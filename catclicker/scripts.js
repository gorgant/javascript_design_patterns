
var cat1Name = "Sam";
var cat2Name = "Jas";

var cat1clickCount = 0;
var cat2clickCount = 0;

appendNames();
clickCounter();

function clickCounter() {
  $('.cat_container').find('img').click(function(e) {
    catId = $(this).parent().attr('id');
    response = incrementClicks(catId);
    $('#'+catId).find('.click_counter').html(response);
  });
}

function incrementClicks(catId) {
  if(catId === "cat1") {
    cat1clickCount +=1;
    return cat1clickCount;
  }
  else {
    cat2clickCount +=1;
    return cat2clickCount;
  }
}

function appendNames() {
  $('.main_content').find('#cat1').children('.cat_name_container').append("<h2>" + cat1Name + "</h2>");
  $('.main_content').find('#cat2').children('.cat_name_container').append("<h2>" + cat2Name + "</h2>");
}