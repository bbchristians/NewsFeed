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
      if ( loginForm["username"] == value["username"] && 
           loginForm["password"] == value["password"]) {
             
        Cookies.set("active-user", loginForm["username"]);
        window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/");
      }
    });
  });
}

function logout() {
  Cookies.set("active-user", "None");
  window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/login.html");
}

function register() {
  registerForm = {};
  $.each($('#register-form').serializeArray(), function(i, field) {
      registerForm[field.name] = field.value;
  });
  
  if (registerForm["password"] != registerForm["password-confirm"] ) {
    // report to user
    return;
  }
  
  // Append new user credentials to json fileCreatedDate
  $.getJSON("js/users.json", function (data) {
    $new_user = {username: registerForm["username"], password: registerForm["password"]};
    data["users"].push($new_user);
    
    $.ajax( {
             url: 'register_user.php',
             data: {username: registerForm["username"],
                    password: registerForm["password"]
                   },
             type: 'post',
             success: function() {
               Cookies.set("active-user", registerForm["username"]);
               window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/");
             }
    });
            
    
    
    /*
    $new_data = JSON.stringify(data);
    $.post("js/users.json", {
              newData: $new_data
            },
            function (response) {
              console.log(reponse);
            });
            */
  });
  
}

function displayLoginName() {
  if( !$("#username-display") ) {
    return;
  }
  
  $active_user = "Not Logged In";
  
  if( Cookies.get("active-user") != "None" ) {
    $active_user = Cookies.get("active-user");
  }
  
  $("#username-display").text($active_user);
}

displayLoginName();











