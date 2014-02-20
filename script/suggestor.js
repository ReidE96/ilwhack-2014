var Suggestor = new Class({
	initialize: function(main){
		this.main = main;

		setTimeout(function(){
			//this.findSuggestions();
			this.giveSugestionsBasedOnFreeTimes();


			/*var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();

			var from = new Date(y, m, d, 13, 30);
			var to = new Date(y, m, d, 15, 00);
			this.giveSuggestion(from, to , 'LC');*/
		}.bind(this), 1000);
	},

	findSuggestions: function(data){
		var locator = new Locator(this);

		locator.giveSuggestion_findAllPossiblePlaces(data, 'store');
	},

	getCallendarEvents: function(){
		var events = $('#calendar').fullCalendar('clientEvents');
		return events;
	},

	giveSuggestion: function(eventData){
		var source = [
				{
					title: eventData.title,
					start: eventData.from,
					end: eventData.to,
					allDay: false,
					editable: false,
					color: '#fff',
					backgroundColor: '#009fe3',
					timeFormat: '',
					location: eventData.location,
					reference: eventData.reference,
					photoUrl: eventData.photoUrl,
					rating: eventData.rating,
					suggestion: true
				}
		];

		$('#calendar').fullCalendar( 'addEventSource', source )
	},

	giveSugestionsBasedOnFreeTimes: function(){
		var events = this.getCallendarEvents();
		var lastEvent = null;
		$.each(events, function( index, value ) {

			if(lastEvent != null){
				this.findTypeOfSuggestion(lastEvent, value);
			}

			lastEvent = value;

		}.bind(this));

	},

	findTypeOfSuggestion: function(firstEvent, secondEvent){
		//console.log(freeTimes);

		var from = new Date(firstEvent.end);
		var to = new Date(secondEvent.start);
		var timeDifference = this.getTimeInMinutesFromMiliseconds(to-from);

		if(timeDifference <= 120){
			var data = new Array(
				new LocTime(new Vec2(firstEvent.location[0], firstEvent.location[1]), from),
				new LocTime(new Vec2(secondEvent.location[0], secondEvent.location[1]), to)
			);

			this.findSuggestions(data);
		}
		
		


	},

	getTimeInMinutesFromMiliseconds: function(time){
		return time/(60*1000);
	},







});