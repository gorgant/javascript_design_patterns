var MyApp = {};


function initMap() {
    MyApp.googleMaps.initMap();
  };


// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
  var self = this;

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
      self.updateList(results);
      console.log("here's your updated places list")
      console.log(self.placesArray());
      MyApp.googleMaps.applyDomClickListeners();
    },

    createMarker: function(place, bounds) {
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        //I've hidden the map so that it doesn't show by default, instead I use the showMarkers function
        // map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        markerId: place.id //My custom marker property to match w DOM element
      });
      google.maps.event.addListener(marker, 'click', function() {
        MyApp.googleMaps.infowindow.setContent(place.name);

        MyApp.googleMaps.infowindow.open(MyApp.googleMaps.thisMap, this);
      });

      google.maps.event.addListener(marker, 'click', function () {
        MyApp.googleMaps.toggleBounce(marker);
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
    },

    toggleBounce: function(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
        }
        console.log("Bounce toggled with this marker id:")
        console.log(marker.markerId);
    },

    applyDomClickListeners: function() {
      for (var i = 0; i < MyApp.googleMaps.markers.length; i++) {
        marker = MyApp.googleMaps.markers[i];
        markerId = marker.markerId;
        console.log("This marker id:");
        console.log(marker.markerId);
        domElement = document.getElementById(marker.markerId)
        console.log("Dom Element to be Modified:")
        console.log(domElement);
        google.maps.event.addDomListener(domElement, 'click', function () {
          self.clickResponse();
        });
      }
    },

  };

  self.GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDN7GQGxljvIGM3fZsiNrmqJQP4Kra-rlk&callback=initMap&libraries=places";
  self.YELP_CLIENT_ID = "80Xa0x2dWoo7fbUUmZ8sBg"
  self.YELP_CLIENT_SECRET = "gjtVRXdRjj4ZBlRLxtrl4sAmju09IHovSYzau0CPDCEBpEah2bRS2zF6aWtuZKq4"
  self.YELP_ACCESS_TOKEN ="hvRhWV3OQHKDR0D97deRhy2zpkb3cJLhbBwDmzLaxFfvwPMGtQUHlyQIRs6wO-Oro90fdSf1h3f9XBwO-TuTZ82qR-I1iY3EZfIYU3mh3X1VlWHSyQpSaLNMp3XwWXYx"

  self.placesArray = ko.observableArray([]);

  self.updateList = function(array) {
    self.placesArray(array); //GCR: FIGURE OUT HOW TO SORT THE NAMES (RATHER THAN THE OBJECTS CONTAINING THEM)
    self.searchYelp();
  };

  self.clickedDomId = "";

  self.clickAction = function(data) {
    console.log("Click registered with this id:");
    console.log(data.id);
    self.clickedDomId = data.id;
  };

  self.clickResponse = function(clickedDomId) {
    console.log("Clicked dom id in clickresponse is:")
    console.log(self.clickedDomId);
    var currentMarker = MyApp.googleMaps.markers.filter(function(marker) {
            return marker.markerId == self.clickedDomId;
          })[0];
    console.log("Click response ID is:")
    console.log(currentMarker.markerId);
    MyApp.googleMaps.toggleBounce(currentMarker);

  };

  self.searchYelp = function() {
    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": "https://api.yelp.com/v3/businesses/search?term=sushi&location=145%20e%2027th%20st.%20new%20york&radius=500",
    //   "method": "GET",
    //   "headers": {
    //     "content-type": "application/x-www-form-urlencoded",
    //     "authorization": "Bearer hvRhWV3OQHKDR0D97deRhy2zpkb3cJLhbBwDmzLaxFfvwPMGtQUHlyQIRs6wO-Oro90fdSf1h3f9XBwO-TuTZ82qR-I1iY3EZfIYU3mh3X1VlWHSyQpSaLNMp3XwWXYx",
    //     "cache-control": "no-cache",
    //     "postman-token": "908a345b-f4e7-11fd-02d4-438c820cc024"
    //   }
    // }

    // $.ajax(settings).done(function (response) {
    //   console.log(response);
    // });
  }
};

// Activates knockout.js
ko.applyBindings(new AppViewModel());

// var settings = {
//   "async": true,
//   "crossDomain": true,
//   "url": "https://api.yelp.com/v3/businesses/search?term=sushi&location=chicago&radius=500",
//   "method": "GET",
//   "headers": {
//     "content-type": "application/x-www-form-urlencoded",
//     "authorization": "Bearer hvRhWV3OQHKDR0D97deRhy2zpkb3cJLhbBwDmzLaxFfvwPMGtQUHlyQIRs6wO-Oro90fdSf1h3f9XBwO-TuTZ82qR-I1iY3EZfIYU3mh3X1VlWHSyQpSaLNMp3XwWXYx",
//     "cache-control": "no-cache",
//     "postman-token": "feb9dd64-c513-ccbc-18d0-3f9ea9345162"
//   }
// }

// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

var YELP_CLIENT_ID = "80Xa0x2dWoo7fbUUmZ8sBg"
var YELP_CLIENT_SECRET = "gjtVRXdRjj4ZBlRLxtrl4sAmju09IHovSYzau0CPDCEBpEah2bRS2zF6aWtuZKq4"
var YELP_ACCESS_TOKEN ="hvRhWV3OQHKDR0D97deRhy2zpkb3cJLhbBwDmzLaxFfvwPMGtQUHlyQIRs6wO-Oro90fdSf1h3f9XBwO-TuTZ82qR-I1iY3EZfIYU3mh3X1VlWHSyQpSaLNMp3XwWXYx"


fetch(`https://api.yelp.com/oauth2/token?client_id=${YELP_CLIENT_ID}&client_secret=${YELP_CLIENT_SECRET}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: JSON.stringify({
    grant_type: 'client_credentials',
  })
})
  .then((res) => res.json())
  .then((resJSON) => {
    this.setState({ access_token: resJSON.access_token });
    console.log(resJSON)
  })
  .then(() => {
    fetch('https://api.yelp.com/v3/businesses/search?location=12345', {
      method: 'GET',
      headers: {
        // "content-type": "application/x-www-form-urlencoded",
        'authorization': 'Bearer ' + this.state.access_token,
        // "cache-control": "no-cache",
      },
    })
    .then((res) => res.json())
    .then((resJSON) => {
      console.log('resJSON', resJSON)
    })
  })
  .catch((err) => {
    console.log('err', err);
  });

  //Try the fusion solution I just bookemarked