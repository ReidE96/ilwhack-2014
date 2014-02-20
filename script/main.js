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

	showPopUp: function(event){
		var htmlText = "\
		<table><tr>\
		<td><div id='map-canvas' class='gmap_canvas'></div>\
		<td><img src='" + event.photoUrl + "' class='eventInfoImg'>\
		<div class='eventInfoText'>\
		" + event.title + "\
		<div id='stars'></div>\
		<tr><td>\
		<center>\
		<div class='eventInfoButtons'>\
		<input type='button' id='eventInfoButtons_yes' value='yes'>\
		<input type='button' id='eventInfoButtons_no' value='no'>\
		<input type='button' id='eventInfoButtons_never' value='never'>\
		</div></center>\
		</table>\
		";
		$( "#popUpDialog" ).html(htmlText);

		console.log(event.rating);

		$('#stars').raty({
    		showHalf:  true,
    		readOnly:  true,
			score:     	event.rating,
			number: 	5
		});

		$('#eventInfoButtons_yes').click(function(){
			this.makeEventReal(event);
			$( "#popUpDialog" ).dialog( "close" );
		}.bind(this));

		$('#eventInfoButtons_no').click(function(){
			$( "#popUpDialog" ).dialog( "close" );
		});

		$('#eventInfoButtons_never').click(function(){
			$( "#popUpDialog" ).dialog( "close" );
		});
		

		$(function() {
			$( "#popUpDialog" ).dialog({ minWidth: 650 });
		});

		this.showMapWithLocation(event.location, event.reference);
	},

	showMapWithLocation: function(location, reference){
		var targetLoc = new google.maps.LatLng(location.getX(), location.getY());
		
		map = new google.maps.Map(document.getElementById('map-canvas'), {
	    	center: targetLoc,
		    zoom: 15
		});

		var request = {
		  reference: reference
		};

		var infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		service.getDetails(request, function(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			  var marker = new google.maps.Marker({
			    map: map,
			    position: place.geometry.location
			  });
			  google.maps.event.addListener(marker, 'click', function() {
			    infowindow.setContent(place.name);
			    infowindow.open(map, this);
			  });
			}
		});

	},

	showMapWithLocationCallbcak: function(place, status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
		    createMarker(place);
		}
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
		        	this.showPopUp(event);

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
	
	// Parameters:
	//	calName: string name to be used for new calendar
	//	callback: callback function, must accept a calendar resource (https://developers.google.com/google-apps/calendar/v3/reference/calendars)
	addGCalendar: function (calName, callback) {
		gapi.client.load('calendar', 'v3', function () {
			var tz = jstz.determine();
			var request = gapi.client.calendar.calendars.insert({"resource":{
				"kind": "calendar#calendar",
				"summary": calName,
				"timeZone": tz.name()
			}});
			request.execute(callback);
		});
	},
	
	// Parameters:
	//	calendar: calendar resource (link above) - must have an id and a timeZone
	//	title: string title for event
	//	start: javascript Date() object representing event start time
	//	end: javascript Date() object representing event end time
	//	callback: callback function, must accept a event resource (https://developers.google.com/google-apps/calendar/v3/reference/events)
	//	recur (optional): string declaring frequency of recurrence - will be appending to RRULE:FREQ= and must obey RFC 5545 sec. 3.3.10
	//										(http://tools.ietf.org/html/rfc5545#section-3.3.10)
	//	location (optional): string location for event
	addEvent: function (calendar, title, start, end, callback, recur, location) {
		gapi.client.load('calendar', 'v3', function () {
			var resource = {
				"kind": "calendar#event",
				"summary": title,
				"start": {
					"dateTime": timestamp(start),
					"timeZone": calendar.timeZone
				},
				"end": {
					"dateTime": timestamp(end),
					"timeZone": calendar.timeZone
				}
			};
			if (recur)
				resource.recurrence = ["RRULE:FREQ=" + recur];
			if (location)
				resource.location = location;
			var request = gapi.client.calendar.events.insert({
				"calendarId": calendar.id,
				"resource": resource
			});
			request.execute(callback);
		});
	},
	
	calendarSetup: function(authResult) {
		if (authResult && !authResult.error) {
			var addSleepEvent = function (cal) {
				if (cal && !cal.error) {
					var start = new Date();
					start.setHours(23,0,0,0);
					var end = new Date(start.getTime() + (8 * 60 * 60 * 1000));
					Main.addEvent(cal, "Sleep", start, end, function(resp) {
						console.log("Sleep event creation response");
						console.log(resp);
					}, "DAILY", "Bed");
				} else {
					console.log("Sleep calendar not created");
					console.log(cal);
				}
			}
			Main.addGCalendar("Sleep", addSleepEvent);
			var addEatEvents = function (cal) {
				if (cal && !cal.error) {
					var start = new Date();
					var end = new Date();
					
					// Breakfast
					start.setHours(7,30,0,0);
					end.setHours(8,0,0,0);
					var startB = new Date(start.getTime());
					var endB = new Date(end.getTime());
					Main.addEvent(cal, "Breakfast", startB, endB, function(resp) {
						console.log("Breakfast event creation response");
						console.log(resp);
					}, "DAILY");
					
					// Lunch
					start.setHours(12,30,0,0);
					end.setHours(13,0,0,0);
					var startL = new Date(start.getTime());
					var endL = new Date(end.getTime());
					Main.addEvent(cal, "Lunch", startL, endL, function(resp) {
						console.log("Lunch event creation response");
						console.log(resp);
					}, "DAILY");
					
					// Dinner
					start.setHours(18,0,0,0);
					end.setHours(19,0,0,0);
					Main.addEvent(cal, "Dinner", start, end, function(resp) {
						console.log("Dinner event creation response");
						console.log(resp);
					}, "DAILY");
				} else {
					console.log("Eat calendar not created");
					console.log(cal);
				}
			}
			Main.addGCalendar("Eat", addEatEvents);
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
