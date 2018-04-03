$(document).foundation();

function replacePlaceholder(html, ph, newValue) {
  return html.replace("%" + ph + "%", newValue);
}

function createNewsArticle(id, title, articleImage, date, ref, desc, author, authorImage) {
  $template = $.get("article.html", function callback(html_string) {
    $replaces = {"id": id,
                "title": title,
                "image": articleImage,
                "date": date,
                "link": ref,
                "desc": desc,
                "author": author,
                "author-image": authorImage
                };
    
    $.each( $replaces, function( key, value ) {
      html_string = replacePlaceholder(html_string, key, value);
    });
    
    $("#articles").append(html_string);
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
        
        $image = "images/placeholder.png";
        $author = "Unknown";
        $authorImage = "images/author-placeholder.png";
        
        
        $.createNewsArticle("article-" + $('.news-card').length,
                            $(value).find("title").text(),
                            $image,
                            $(value).find("pubDate").text(),
                            $(value).find("link").text(),
                            $(value).find("description").text(),
                            $author,
                            $authorImage
                            );
      });
    }
  });
}

UpdateESPNNews("NHL");