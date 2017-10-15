
var catsObject = {
  "cats" : [
    {
      "name" : "Sam",
      "picture" : "http://lorempixel.com/400/400/cats/",
      "clickCount" : "0"
    },
    {
      "name" : "Jas",
      "picture" : "http://lorempixel.com/400/402/cats/",
      "clickCount" : "0"
    },
    {
      "name" : "Frank",
      "picture" : "http://lorempixel.com/400/404/cats/",
      "clickCount" : "0"
    },
    {
      "name" : "Sally",
      "picture" : "http://lorempixel.com/400/406/cats/",
      "clickCount" : "0"
    },
    {
      "name" : "Polka",
      "picture" : "http://lorempixel.com/400/408/cats/",
      "clickCount" : "0"
    }
  ]
};

catsObject.display = function() {
  var idCounter = 0;
  catsObject.cats.forEach(function(cat) {

    var catName = cat.name;
    var catPicture = cat.picture;

    var elem = document.createElement('div');
    elem.setAttribute("class","cat_list_item");
    elem.textContent = catName;

    $('#cat_list').append(elem);

    $(elem).click(function() {
      displayCatData(catName, catPicture, cat);
      console.log("You selected the cat: " + cat.name);
    });
  })
};

catsObject.display();

function displayCatData (name, picture, cat) {
  console.log(name, picture, cat.clickCount);

  var catNameHTML = `<h3>${name}</h3>`;
  var catImageHTML = `<img class="img-fluid" src="${picture}" id="cat_image">`;
  var catClickCountHTML = '<h4> Click Count </h4>' + cat.clickCount;

  $('#cat_name_container').html(catNameHTML);
  $('#cat_image_container').html(catImageHTML);
  $('#cat_click_count_container').html(catClickCountHTML);

  $('#cat_image').click(function() {
      console.log('Cat to be incremented: ' + cat.name);
      cat.clickCount ++
      var newCatClickCountHTML = '<h4> Click Count </h4>' + cat.clickCount;
      $('#cat_click_count_container').html(newCatClickCountHTML);
    });
};