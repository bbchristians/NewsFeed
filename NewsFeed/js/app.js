$(document).foundation();

function createBlankTemplate() {
  $template = $.get("../article.html");
  console.log($template);
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