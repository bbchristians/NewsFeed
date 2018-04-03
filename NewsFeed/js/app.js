$(document).foundation();

function createBlankTemplate() {
  $.get("http://www.se.rit.edu/~bbc7909/NewsFeed/article.html", function callback(html_string) {
    console.log(html_string);
  });
}


function UpdateESPNNews(league) {
  $url = "http://www.espn.com/espn/rss/" + league + "/news";
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

//UpdateESPNNews("NHL");
createBlankTemplate();