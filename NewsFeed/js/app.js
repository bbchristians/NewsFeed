$(document).foundation();

function createBlankTemplate() {
  $.get("../article.html", function callback(html_string) {
    console.log(html_string);
  });
}


function UpdateBBCWorldNews() {
  $url = "http://feeds.bbci.co.uk/news/world/rss.xml";
  $.ajax({
    url: $url,
    dataType: 'xml',
    success: function(data) {
      // Get all news items from data
      $items = $(data).find("item");
      // For each item in data, display
      $.each( $items, function( index, value ) {
        console.log($(value).find("title").text());
      });
    }
  });
}