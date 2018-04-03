$(document).foundation();

// Nav bar js
$("[data-menu-underline-from-center] a").addClass("underline-from-center");


// My js
function clearNewsFeed(cb) {
  $("#articles").empty();
  // TODO Don't make callback if articles is null
  cb();
}

function replacePlaceholder(html, ph, newValue) {
  return html.replace("%" + ph + "%", newValue);
}

function createNewsArticle(title, articleImage, date, ref, desc, author, authorImage) {
  $template = $.get("article.html", function callback(html_string) {
    $replaces ={"title": title,
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
        
        
        createNewsArticle($(value).find("title").text(),
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

function swapFeeds(newFeed) {
  clearNewsFeed(function() {
    UpdateESPNNews(newFeed);
  });
}

swapFeeds("NHL");

/*
// Login functionality
$('#login-form').submit(function() {
  
  var $inputs = $('#login-form :input');
  var values = {};
  
  $inputs.each(function() {
    values[this.name] = $(this).val();
  });
  
  $.getJSON("js/users.json", function (json) {
    $.each( data["users"], function (key, value) {
      Cookies.set("test", (key + ":" + value));
    });
  });
    
});
*/

function login() {
  loginForm = {};
  $.each($('#login-form').serializeArray(), function(i, field) {
      loginForm[field.name] = field.value;
  });
  
  $.getJSON("js/users.json", function (data) {
    $.each( data["users"], function (key, value) {
      if ( loginForm["username"] === value["username"] && 
           loginForm["password"] === value["password"]) {
             
        console.log("validated");
      }
    });
  });
}












