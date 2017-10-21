var initialCats = [
    {
      "catId" : 1,
      "name" : "Sam",
      "picture" : "http://lorempixel.com/400/400/cats/",
      "clickCount" : 0
    },
    {
      "catId" : 2,
      "name" : "Jas",
      "picture" : "http://lorempixel.com/400/402/cats/",
      "clickCount" : 0
    },
    {
      "catId" : 3,
      "name" : "Frank",
      "picture" : "http://lorempixel.com/400/404/cats/",
      "clickCount" : 0
    },
    {
      "catId" : 4,
      "name" : "Sally",
      "picture" : "http://via.placeholder.com/403x403",
      "clickCount" : 0
    },
    {
      "catId" : 5,
      "name" : "Polka",
      "picture" : "http://via.placeholder.com/408x408",
      "clickCount" : 0
    }
  ];

// var ViewModel = function() {

//   var self = this;

//   self.catList = ko.observableArray(initialCats);

//   self.currentCat = ko.observable(new Cat(self.catList()[4]));

//   self.updateCat = function(cat) {
//     self.currentCat(new Cat(cat));
//   };

//   self.incrementCounter = function() {
//     var selectedCat = self.catList().filter(function(cat) {
//         return cat.catId === self.currentCat().catId();
//       })[0];
//     selectedCat.clickCount += 1;
//     self.currentCat().clickCount(selectedCat.clickCount);
//   };
// }

var ViewModel = function() {

  var self = this;

  self.catList = ko.observableArray([]);

  initialCats.forEach(function(catItem) {
    console.log(catItem);
    self.catList.push(new Cat(catItem));
  });

  console.log(self.catList());

  self.currentCat = ko.observable(self.catList()[4]);

  self.updateCat = function(cat) {
    self.currentCat(cat);
    console.log(cat);
  };

  self.incrementCounter = function() {
    self.currentCat().clickCount(self.currentCat().clickCount() + 1);
  };
}


var Cat = function(cat) {
  this.catId = ko.observable(cat.catId);
  this.clickCount = ko.observable(cat.clickCount);
  this.name = ko.observable(cat.name);
  this.imgSrc = ko.observable(cat.picture);
  this.imgAttribution = ko.observable('https://www.flickr.com/photos');
  this.nicknames = ko.observableArray(["Tab", "Bee", "Tabber", "Tabberoo"]);
  this.level = ko.computed(function() {
    if(this.clickCount() < 10) {
      return 'Infant';
    }
    else if(this.clickCount() < 20) {
      return 'Teen';
    }
    else {
      return 'Adult';
    }
  }, this);

}

ko.applyBindings(new ViewModel());