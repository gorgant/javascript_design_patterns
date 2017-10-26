var MyApp = {};


function initMap() {
    MyApp.googleMaps.initMap();
  };


// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
  var self = this;

  self.globalArray = ko.observableArray(["Tab", "Bee", "Tabber", "Tabberoo"]);

  MyApp.googleMaps = {

    //At the top here I'm storing the variables as objects in the GoogleMaps class
    thisMap: "",

    infowindow: "",

    markers: [],

    initMap: function() {
      var myLocation = new google.maps.LatLng(40.7417860,-73.9820010);

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

      searchBox.addListener('places_changed', function() {
        MyApp.googleMaps.deleteMarkers();

        var locationInput = searchBox.getPlaces();
        console.log(locationInput);

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
            console.log(MyApp.googleMaps.markers);
            console.log(results);
            MyApp.googleMaps.configureMarkersAndBounds(results, bounds);
          }
        };
      });
    },

    configureMarkersAndBounds: function(results, bounds) {
      var updatedBounds = bounds;

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        updatedBounds = MyApp.googleMaps.createMarker(place, updatedBounds);
      }
      MyApp.googleMaps.thisMap.fitBounds(updatedBounds);
      console.log("Here's your array of markers");
      console.log(MyApp.googleMaps.markers);
      MyApp.googleMaps.showMarkers();
      console.log("here's your updated globals")
      self.updateList(self.globalArray);
      console.log(self.markersArray());
    },

    createMarker: function(place, bounds) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        //I've hidden the map so that it doesn't show by default, instead I use the showMarkers function
        // map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      });
      google.maps.event.addListener(marker, 'click', function() {
        MyApp.googleMaps.infowindow.setContent(place.name);

        MyApp.googleMaps.infowindow.open(MyApp.googleMaps.thisMap, this);
      });

      MyApp.googleMaps.markers.push(marker);
      self.globalArray.push(marker);
      console.log("marker added");

      //This is for setting the map bounds -- basically, the location logged here will expand the bounds
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      return bounds;
    },

    showMarkers: function() {
      MyApp.googleMaps.setMapOnAll(MyApp.googleMaps.thisMap);
    },

    setMapOnAll: function(thisMap) {
      for (var i = 0; i < MyApp.googleMaps.markers.length; i++) {
        MyApp.googleMaps.markers[i].setMap(thisMap);
      }
    },

    clearMarkers: function() {
      MyApp.googleMaps.setMapOnAll(null);
    },

    deleteMarkers: function() {
      MyApp.googleMaps.clearMarkers();
      MyApp.googleMaps.markers = [];
      self.globalArray = [];
    }

  };

  self.GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDN7GQGxljvIGM3fZsiNrmqJQP4Kra-rlk&callback=initMap&libraries=places";
  self.markersArray = ko.observableArray(self.globalArray()); //GCR: FIGURE OUT HOW TO ACCESS THIS MAYBE W A SEPARATE VIEW MODEL? OR BY PUTTING THE WHOLE GOOGLE MAPS IN THIS VIEW MODEL?
  console.log(self.markersArray());
  self.updateList = function(array) {
    self.markersArray(array);
  };

};

// Activates knockout.js
ko.applyBindings(new AppViewModel());