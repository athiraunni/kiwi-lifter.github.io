// global variable for collecting asynchronous request info
var data;

/**
* @description An IIFE: makes XMLHttpRequest to a JSON formatted js file, invokes a google map initialise function, 
* and instantiates a knockout object.
 **/

(function(){

/**
* @description Makes an ajax request to a JSON format file of restaurant info.
**/
 
var jqxhr = $.ajax( "js/restaurant-data.json" )
  .done(function() {
	alert( "first complete" );
  })
  .fail(function() {
    alert( "Sorry, looks like there is no data available right now. :(" );
  })
  .always(function() {
	data = jqxhr.responseJSON;
    console.log(data);
	
	// Activate google map.
	initMap();
				
	// Activat knockout.js.
	ko.applyBindings(new AppViewModel);
  });
 
				
}());

/**
* @description Knockout view model.
 **/
function AppViewModel() {
	
	var self = this;
	
	self.restaurants = ko.observableArray(data.restaurants);

	self.search_Name = ko.observable('');
	
	
/**
* @description setVisible only restaurant markers that are returned in the search result.
* @param {Object[]} search result
* @param {Object[]} full restaurant list
 **/
    self.showFilteredMarkers = function(filteredSearchArray, restaurantsArray) {
		
		for (var i = 0; i < restaurantsArray.length; i++) {
			restaurantsArray[i].marker.setVisible(false);
		}
		
		for (var i = 0; i < filteredSearchArray.length; i++) {
			
				filteredSearchArray[i].marker.setVisible(true);
			}
			
	};
	
/**
* @description Calculates and returns the result of a restaurant search and calls a 
* function to update the markers to reflect the search results.
 **/
	self.filteredRestaurants = ko.computed(function () {
	
	var searchResult = ko.utils.arrayFilter(self.restaurants(), function (restaurant) {
		    return (
                      (self.search_Name().length == 0 || restaurant.name.toLowerCase().indexOf(self.search_Name().toLowerCase()) > -1)
                   )        
    });
		self.showFilteredMarkers(searchResult, self.restaurants());
	
		return searchResult;
	});
	
/**
* @description Invoke the listener event on the repective google map marker when a restaurant list item is clicked.
* @param {object} restaurant 
 **/
	self.openInfowindow = function(location) {

		google.maps.event.trigger(location.marker, 'click');
    }
	
 }
