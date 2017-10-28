//This stores the entire goggleMaps data for easier access outside the module (may not be necessary?)
var MyApp = {};

//This is triggered by the maps script in the google maps script url
function initMap() {
    MyApp.googleMaps.initMap();
  };


// This is the ViewModel used by Knockout
function AppViewModel() {
  var self = this;

  MyApp.googleMaps = {

    //At the top here I'm storing the variables as objects in the GoogleMaps class
    thisMap: "",

    infowindow: "",

    markers: [],

    initMap: function() {
      var myLocation = new google.maps.LatLng(40.7417860,-73.9820010);

      //Sets the map's initial location
      MyApp.googleMaps.thisMap = new google.maps.Map(document.getElementById('map'), {
        center: myLocation,
        zoom: 13,
        mapTypeId: 'roadmap'
      });

      MyApp.googleMaps.infowindow = new google.maps.InfoWindow();

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      MyApp.googleMaps.thisMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      MyApp.googleMaps.thisMap.addListener('bounds_changed', function() {
        searchBox.setBounds(MyApp.googleMaps.thisMap.getBounds());
      });

      //This listens for a change in location using the search bar
      searchBox.addListener('places_changed', function() {
        MyApp.googleMaps.deleteMarkers();

        var locationInput = searchBox.getPlaces();

        if (locationInput.length == 0) {
          return;
        }

        //Grabs the address entered and sets it as the location
        var newLocation = locationInput[0].geometry.location;

        //Sets the parameters for the nearby search
        var request = {
          location: newLocation,
          radius: '500',
          type: ['restaurant']
        }

        //Initializes a Places service
        service = new google.maps.places.PlacesService(MyApp.googleMaps.thisMap);
        //Conducts the nearby search
        service.nearbySearch(request, gatherMarkers);

        //Sets a bounds variable to be used lower down (maybe movbe this down)
        var bounds = new google.maps.LatLngBounds();



        //Create markers for each request result
        function gatherMarkers(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            MyApp.googleMaps.configureMarkersAndBounds(results, bounds);
          }
        };
      });
    },

    //This is a core display function for data on the screen
    configureMarkersAndBounds: function(results, bounds) {
      var updatedBounds = bounds;

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        updatedBounds = MyApp.googleMaps.createMarker(place, updatedBounds);
      }
      MyApp.googleMaps.thisMap.fitBounds(updatedBounds);
      MyApp.googleMaps.showMarkers();
      self.updateList(results);
      MyApp.googleMaps.applyDomClickListeners();
    },

    //This creates a marker with all the appropriate listeners and properties
    createMarker: function(place, bounds) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        //I've hidden the map so that it doesn't show by default, instead I use the showMarkers function
        // map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        markerId: place.id //My custom marker property to match w DOM element
      });

      //pops a window when a marker is clicked
      google.maps.event.addListener(marker, 'click', function() {
        MyApp.googleMaps.infowindow.setContent(place.name);
        MyApp.googleMaps.infowindow.open(MyApp.googleMaps.thisMap, this);
      });

      //Add marker to the maps array (for gmaps) and the global array (for the knockout scripts)
      MyApp.googleMaps.markers.push(marker);
      self.globalArray.push(marker);

      //This is for setting the map bounds -- basically, the location logged here will expand the bounds
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      return bounds;
    },

    //Kicks of the setMapOnAll
    showMarkers: function() {
      MyApp.googleMaps.setMapOnAll(MyApp.googleMaps.thisMap);
    },

    //This "places" the markers on the screan (setting their map value)
    setMapOnAll: function(thisMap) {
      for (var i = 0; i < MyApp.googleMaps.markers.length; i++) {
        MyApp.googleMaps.markers[i].setMap(thisMap);
      }
    },

    //Hides the markers but doesn't delete them
    clearMarkers: function() {
      MyApp.googleMaps.setMapOnAll(null);
    },

    //Hides the markers and clears the marker array (effectively deleting them)
    deleteMarkers: function() {
      MyApp.googleMaps.clearMarkers();
      MyApp.googleMaps.markers = [];
      self.globalArray = [];
    },

    //This gets those markers to bounce
    toggleBounce: function(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
    },

    //This applies the click listeners to the DOM list items, listening for a click that then triggers a bounce
    applyDomClickListeners: function() {
      for (var i = 0; i < MyApp.googleMaps.markers.length; i++) {
        marker = MyApp.googleMaps.markers[i];
        markerId = marker.markerId;
        domElement = document.getElementById(marker.markerId)
        google.maps.event.addDomListener(domElement, 'click', function () {
          self.clickResponse();
        });
      }
    },

  };

  self.GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDN7GQGxljvIGM3fZsiNrmqJQP4Kra-rlk&callback=initMap&libraries=places";

  self.placesArray = ko.observableArray([]);

  self.updateList = function(array) {
    self.placesArray(array); //GCR: FIGURE OUT HOW TO SORT THE NAMES (RATHER THAN THE OBJECTS CONTAINING THEM)
    self.hideData("");
  };

  //This stores a DOM value for use below
  self.clickedDomId = "";

  //This helps prevent some things from loading until the yelp data has loaded
  self.yelpLoaded = ko.observable(false);

  //This defines what happens when a list item is clicked
  self.clickAction = function(data) {
    self.clickedDomId = data.id;
    self.yelpData = ko.observable();
    self.yelpStatus = ko.observable();
    self.yelpLoaded(false);
    console.log(data);
    self.searchYelp(data.name, data.vicinity)
      .done(function(result) {
        self.yelpData(result);
        if(self.yelpData().is_closed){
          self.yelpStatus({status: "Closed"});
        }
        else{
          self.yelpStatus({status: "Open for Business"});
        }
        self.yelpLoaded(true);
      })
      .done(function(){
        self.hideData(self.clickedDomId)
      });
  };

  //get the marker to bounce when a list item is clicked (this sends the data to the google maps api)
  self.clickResponse = function(clickedDomId) {
    var currentMarker = MyApp.googleMaps.markers.filter(function(marker) {
            return marker.markerId == self.clickedDomId;
          })[0];
    MyApp.googleMaps.toggleBounce(currentMarker);


  };

  //kick off the json request on the server side (backend.py)
  self.searchYelp = function(businessName, location) {
    return $.getJSON("/yelpBusinessSearch",
              {business: businessName, location: location},
              function(response){
              });
  };

  self.applyYelpBinding = function(data, yelpData) {
    $(`#${data.id}`).append('<div class="yelp_data">Yelp Rating: <span data-bind="text: $yelpData.rating"></span></div>');
  };

    self.hideData = function(id) {
    $('.yelp-info-container').each(function(elem){
      var thisId = $(this).closest(".list-item").attr('id');
      if(thisId == id){
        $(this).toggle(); //First toggles the item hidden so that it can be slid down
        $(this).slideDown(); //Provides a cool slide down animation
      }
      else {
        $(this).toggle();
      }
    });
  }

};

// Activates knockout.js
ko.applyBindings(new AppViewModel());
