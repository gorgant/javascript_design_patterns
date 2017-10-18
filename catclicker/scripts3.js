$(function(){

    var model = {
          "cats" : [
            {
              "catId" : "1",
              "name" : "Sam",
              "picture" : "http://lorempixel.com/400/400/cats/",
              "clickCount" : "0"
            },
            {
              "catId" : "2",
              "name" : "Jas",
              "picture" : "http://lorempixel.com/400/402/cats/",
              "clickCount" : "0"
            },
            {
              "catId" : "3",
              "name" : "Frank",
              "picture" : "http://lorempixel.com/400/404/cats/",
              "clickCount" : "0"
            },
            {
              "catId" : "4",
              "name" : "Sally",
              "picture" : "http://lorempixel.com/400/406/cats/",
              "clickCount" : "0"
            },
            {
              "catId" : "5",
              "name" : "Polka",
              "picture" : "http://via.placeholder.com/408x408",
              "clickCount" : "0"
            }
          ]
        };

    var octopus = {
        init: function() {
          listView.renderList();
          adminView.init();
        },

        getCat: function(catId) {
          var thisCat = model.cats.filter(function(cat) {
            return cat.catId == catId;
          })[0];
          return thisCat;
        },

        getAllCats: function() {
          return model.cats;
        },

        logClick: function(catId) {
          var thisCat = octopus.getCat(catId);
          var clickCount = thisCat.clickCount;
          clickCount ++;
          thisCat.clickCount = clickCount;
        },

        getClickCount: function(catId) {
          var thisCat = octopus.getCat(catId);
          var clickCount = thisCat.clickCount;
          return clickCount;
        },

        updateCatData: function(submittedData, catId) {
          var name = submittedData.name;
          var picture = submittedData.picUrl;
          var clickCount = submittedData.numClicks;
          var thisCatId = catId
          thisCat = this.getCat(thisCatId);
          thisCat.name = name;
          thisCat.picture = picture;
          thisCat.clickCount = clickCount;
          listView.renderList();
          catView.renderCat(thisCatId);
        }
    };

    var listView = {
      renderList: function() {
        $('#cat_list').html("");
        var catList = octopus.getAllCats();
        catList.forEach(function(cat) {
          var elem = document.createElement('div');
          elem.setAttribute("class","cat_list_item");
          elem.textContent = cat.name;
          $('#cat_list').append(elem);

          $(elem).click(function() {
            catView.renderCat(cat.catId);
            console.log("You selected the cat: " + cat.name);
            adminView.loadAdmin(cat.catId);
          });
        });
      }
    };

    var catView = {
      renderCat: function(catId) {
        var thisCat = octopus.getCat(catId);

        var catNameHTML = `<h3>${thisCat.name}</h3>`;
        var catImageHTML = `<img class="img-fluid" src="${thisCat.picture}" id="cat_image">`;
        var catClickCountHTML = '<h4> Click Count </h4>' + thisCat.clickCount;

        $('#cat_name_container').html(catNameHTML);
        $('#cat_image_container').html(catImageHTML);
        $('#cat_click_count_container').html(catClickCountHTML);

        $('#cat_image').click(function() {
          console.log('Cat to be incremented: ' + thisCat.name);
          octopus.logClick(thisCat.catId);
          catView.updateCatView(thisCat.catId);
        });
      },

      updateCatView: function(catId) {
        var thisCat = octopus.getCat(catId);
        var newCatClickCountHTML = '<h4> Click Count </h4>' + thisCat.clickCount;
        $('#cat_click_count_container').html(newCatClickCountHTML);

      }
    };

    var adminView = {
      init: function(catId) {
        $('#admin_form_container').toggle();
      },

      loadAdmin: function(catId) {
        console.log("admin loaded");
        $('#admin_button').click(function() {
          adminView.renderAdmin(catId);
        });
      },

      renderAdmin: function(catId) {
        $('#admin_form_container').toggle();
        $('#admin_form_container').submit(function(e) {
          event.preventDefault();
          var submittedData = $( this ).serializeArray();
          var dataObject = {};
          jQuery.each(submittedData, function(i, field) {
            dataObject[field.name] = field.value;
          });
          octopus.updateCatData(dataObject, catId);
        });
        $('#cancel').click(function() {
          $('#admin_form_container').toggle();
        });
      }
    };

  octopus.init();
});
