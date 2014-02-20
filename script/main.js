var timestamp = function (date) {
	/*
	Internet Timestamp Generator
	Copyright (c) 2009 Sebastiaan Deckers
	License: GNU General Public License version 3 or later
	Alterations: Euan Reid, 2014
	*/
	date = date ? date : new Date();
	var offset = date.getTimezoneOffset();
	this.pad = function (amount, width ){
		var padding = "";
		while (padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1))
		padding += "0";
		return padding + amount.toString();
	}
	return this.pad(date.getFullYear(), 4)
		+ "-" + this.pad(date.getMonth() + 1, 2)
		+ "-" + this.pad(date.getDate(), 2)
		+ "T" + this.pad(date.getHours(), 2)
		+ ":" + this.pad(date.getMinutes(), 2)
		+ ":" + this.pad(date.getSeconds(), 2)
		+ "." + this.pad(date.getMilliseconds(), 3)
		+ (offset > 0 ? "-" : "+")
		+ this.pad(Math.floor(Math.abs(offset) / 60), 2)
		+ ":" + this.pad(Math.abs(offset) % 60, 2);
}

var MainClass = new Class({
	
	initialize: function(){
	},

	ready: function(){
		this.showCalendar('#calendar');

		this.suggestor = new Suggestor(this);

		this.drawSpiderGraph('#spidergraph');

		/*$(function() {
			$( "#dialog" ).dialog();
		});*/

			/*$('#popupBox').bPopup({
            fadeSpeed: 'slow',
            followSpeed: 1500,
            //modal: false
        });*/
	},

	showPopUp: function(){
		$( "#popUpDialog" ).html("<input type='button' value='yes'>");

		$(function() {
			$( "#popUpDialog" ).dialog();
		});
	},

	makeEventReal: function(event){
		var source = [
				{
					title: event.title,
					start: event.start,
					end: event.end,
					allDay: false,
					editable: false,
					textColor: '#000',
					backgroundColor: '#fff',
					timeFormat: '',
					suggestion: false
				}
		];

		$('#calendar').fullCalendar( 'removeEvents', event._id );
		$('#calendar').fullCalendar( 'addEventSource', source );
	},

	showCalendar: function(div){
		var calendar = $(div).fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			titleFormat: {
				month: 'MMMM yyyy',
				week: "d [ MMM]{ '&#8212;' [ d MMM]} yyyy",
				day: 'dddd, MMM d, yyyy'
			},
			firstDay: 1,
			aspectRatio: 1.6,
			defaultView: 'agendaWeek',
			
			selectable: true,
			selectHelper: true,
			/*select: function(start, end, allDay) {

				var title = prompt('Event Title:');
				if (title) {
					calendar.fullCalendar('renderEvent',
						{
							title: title,
							start: start,
							end: end,
							allDay: allDay
						},
						true // make the event "stick"
					);
				}
				calendar.fullCalendar('unselect');
			},*/
			editable: true,
			dropable: true,
			
			eventSources: 
				[
					{url: '/php/userData.php'}
				],

			eventClick: function(event, element) {
				console.log(event);

		        if(event.suggestion == true){
		        	this.showPopUp();

		        	//$('#calendar').fullCalendar('updateEvent', event);
		        }

		    }.bind(this),

		});
	},
	
	drawSpiderGraph: function(diva){
		$(diva).spidergraph({
			'fields': ['live','work','play','rest'],
			'gridcolor': 'rgba(20,20,20,0)'
		});
		/*$(diva).spidergraph('addlayer', { 
			'strokecolor': 'rgba(230,230,230,0.8)',
			'fillcolor': 'rgba(0,0,0,0)',
			'data': [9, 14, 19, 13]
		});
		$(diva).spidergraph('addlayer', { 
			'strokecolor': 'rgba(0,0,0,0)',
			'fillcolor': 'rgba(0,0,230,0.6)',
			'data': [4, 9, 8, 1]

		});*/

	},
	
	calendarSetup: function(authResult) {
		if (authResult && !authResult.error) {
			gapi.client.load('calendar', 'v3', function() {
				var request = gapi.client.calendar.calendars.insert({
					"kind": "calendar#calendar",
					"summary": "Sleep"
				});
				request.execute(function(cal) {
					if (cal) {
						gapi.client.load('calendar', 'v3', function () {
							var start = new Date();
							start.setHours(23);
							var end = new Date(start.getTime() + (8 * 60 * 60 * 1000));
							var req = gapi.client.calendar.events.insert({
								"kind": "calendar#event",
								"calendarId": cal.id,
								"summary": "Sleep",
								"location": "Bed",
								"start": {
									"dateTime": timestamp(start)
								},
								"end": {
									"dateTime": timestamp(end)
								},
								"recurrence": ["RRULE:FREQ=DAILY"]
							});
							req.execute(function(resp) {
								console.log("event creation response");
								console.log(resp);
							});
						});
					} else {
						console.log("calendar not created");
						console.log(cal);
					}
				});
			});
		} else {
			console.log("authorisation error");
			console.log(authResult);
		}
	}

});


var Main = new MainClass();

$(document).ready(function() {
	Main.ready();

  	

}).bind(this);
