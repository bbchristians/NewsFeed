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

function ShowAllNewsFeeds() {

    clearNewsFeed(function() {
        $newsFeeds = ["NHL", "NFL", "NCAA", "NBA"];

        $articles = {};
        $.each($newsFeeds, function (index, value) {
            $url = "http://www.espn.com/espn/rss/" + value + "/news";

            $.ajax({
                url: $url,
                dataType: 'xml',
                async: 'false',
                success: function (data) {
                    // Get all news items from data
                    $items = $(data).find("item");
                    // For each item in data, display
                    $.each($items, function (index, value) {

                        function pad(n){return n<10 ? '0'+n : n}
                        $date = new Date( $(value).find("pubDate").text() );
                        $articles[$date.getFullYear() + " " + $date.getMonth() + " " + pad($date.getDate()) + " " + $date.getHours() + " " + $date.getMinutes() + " " + $date.getSeconds()] = $(value);

                    });
                }
            });
        });

        setTimeout(function(){
            $keys = Object.keys($articles);
            $keys.sort();
            $keys.reverse();
            $.each($keys, function (index, value) {
                $article = $articles[value];
                $image = "images/placeholder.png";
                $author = "Unknown";
                $authorImage = "images/author-placeholder.png";


                createNewsArticle(
                    $article.find("title").text(),
                    $image,
                    $article.find("pubDate").text(),
                    $article.find("link").text(),
                    $article.find("description").text(),
                    $author,
                    $authorImage
                );
            });
        }, 2000);
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

// Start at the NHL feed
swapFeeds("NHL");

function login() {
  loginForm = {};
  $.each($('#login-form').serializeArray(), function(i, field) {
      loginForm[field.name] = field.value;
  });
  
  $.getJSON("js/users.json", function (data) {
      $badCreds = true;
    $.each( data["users"], function (key, value) {
      if ( loginForm["username"] == value["username"] && 
           loginForm["password"] == value["password"]) {

          $badCreds = false;
             
        Cookies.set("active-user", loginForm["username"]);
        Cookies.set("last-login", value["lastlogin"]);
        
        $currentdate = new Date(); 
        $currentTime = ($currentdate.getMonth()+1) + "/"
                    + $currentdate.getDate()  + "/" 
                    + $currentdate.getFullYear() + " @ "  
                    + $currentdate.getHours() + ":"  
                    + $currentdate.getMinutes() + ":" 
                    + $currentdate.getSeconds();
        
        $.ajax( {
             url: 'record_login.php',
             data: {username: loginForm["username"],
                    lastlogin: $currentTime
                   },
             type: 'get',
             success: function(output) {
               console.log("output:" + output);
                 //alert('Exception:');
             },
             error: function(jqxhr, status, exception) {
              // alert('Exception:', exception);
             }
        });
        
        window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/");
      }
    });
    if ( $badCreds ) {
        showBadCredentialsMessage();
    }
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
             success: function(output) {
               Cookies.set("active-user", registerForm["username"]);
               window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/");
             },
             error: function(jqxhr, status, exception) {
               //alert('Exception:', exception);
             }
    });
  });
  
}

function displayLoginName() {
  if( !$("#username-display") ) {
    return;
  }
  
  // Set active user display
  $active_user = "Not Logged In";
  
  if( Cookies.get("active-user") != "None" ) {
    $active_user = Cookies.get("active-user");
  }
  
  $("#username-display").text($active_user);
  
  // Set last login display
  $last_login = "Never";
  
  if( Cookies.get("last-login") != "None" ) {
    $last_login = Cookies.get("last-login");
  }
  
  $("#last-login-display").text("Last logged in: " + $last_login);
  
}

displayLoginName();

function showBadCredentialsMessage() {
    $("#incorrect-pw").css("display", "block");
}









