$(document).foundation();

// Nav bar js
$("[data-menu-underline-from-center] a").addClass("underline-from-center");


// My js
function clearNewsFeed(cb) {
  $("#articles").empty();
  $("#favorites").empty();
  // TODO Don't make callback if articles is null
  cb();
}

function replacePlaceholder(html, ph, newValue) {
  return html.replace(new RegExp("%" + ph + "%", "g"), newValue);
}


// From https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
function hash(s) {
    var hash = 0, i, chr;
    if (s.length === 0) return hash;
    for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    if( hash < 0 ) {
        hash = hash * -1;
    }
    return hash;
}

function createNewsArticle(dest_id, id, title, articleImage, date, ref, desc, author, authorImage, fav) {
  $template = $.get("article.html", function callback(html_string) {
    $replaces ={"id" : id,
                "title": title,
                "image": articleImage,
                "date": date,
                "link": ref,
                "desc": desc,
                "author": author,
                "author-image": authorImage,
                "fav": fav
                };
    
    $.each( $replaces, function( key, value ) {
      html_string = replacePlaceholder(html_string, key, value);
    });
    
    $("#" + dest_id).append(html_string);
  });
}

function ShowAllNewsFeeds() {

    $.ajax({
        dataType: "json",
        url: "js/users.json",
        success: function (data) {

            $favorites = [];
            $.each(data["users"], function(index, value) {
                if (value.username === Cookies.get("active-user")) {
                    $favorites = value.favorites;
                }
            });

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
                            // For each item in data, add it to the map
                            $.each($items, function (index, value) {

                                function pad(n){return n<10 ? '0'+n : n}
                                $date = new Date( $(value).find("pubDate").text() );
                                $fav_flag = $.inArray(hash($(value).find("link").text()).toString(), $favorites) !== -1 ? "f" : "";
                                $articles[$fav_flag + $date.getFullYear() + " " + pad($date.getMonth()) + " " + pad($date.getDate()) + " " + pad($date.getHours()) + " " + pad($date.getMinutes()) + " " + pad($date.getSeconds())] = $(value);

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
                        $favorited = $.inArray(hash($article.find("link").text()).toString(), $favorites) !== -1 ? "is-favorited" : "unfavorited";
                        $destination = $.inArray(hash($article.find("link").text()).toString(), $favorites) !== -1 ? "favorites" : "articles";

                        createNewsArticle(
                            $destination,
                            hash($article.find("link").text()),
                            $article.find("title").text(),
                            $image,
                            $article.find("pubDate").text(),
                            $article.find("link").text(),
                            $article.find("description").text(),
                            $author,
                            $authorImage,
                            $favorited
                        );
                    });
                }, 2000);
            });
        }
    })



}


function UpdateESPNNews(league) {
  $url = "http://www.espn.com/espn/rss/" + league + "/news";
  $.ajax({
    url: $url,
    dataType: 'xml',
    success: function(data) {

        $.ajax({
            dataType: "json",
            url: "js/users.json",
            success: function (users_data) {
                $favorites = [];
                $.each(users_data["users"], function (index, value) {
                    if (value.username === Cookies.get("active-user")) {
                        $favorites = value.favorites;
                    }
                });

                // Get all news items from data
                $items = $(data).find("item");
                // For each item in data, display
                $.each($items, function (index, value) {

                    $image = "images/placeholder.png";
                    $author = "Unknown";
                    $authorImage = "images/author-placeholder.png";
                    $favorited = $.inArray(hash($(value).find("link").text()).toString(), $favorites) !== -1 ? "is-favorited" : "unfavorited";
                    $destination = $.inArray(hash($(value).find("link").text()).toString(), $favorites) !== -1 ? "favorites" : "articles";

                    createNewsArticle(
                        $destination,
                        hash($(value).find("link").text()),
                        $(value).find("title").text(),
                        $image,
                        $(value).find("pubDate").text(),
                        $(value).find("link").text(),
                        $(value).find("description").text(),
                        $author,
                        $authorImage,
                        $favorited
                    );
                })
            }
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
               window.location.replace("http://www.se.rit.edu/~bbc7909/NewsFeed/");
             },
             error: function(jqxhr, status, exception) {
              // alert('Exception:', exception);
             }
        });
        

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

function toggleFavorite(favID) {
    $fav = $("#" + favID)[0];

    if( $fav.classList.contains("unfavorited") ) {
        $("#" + favID).removeClass("unfavorited").addClass("is-favorited");
        $operation = "favorite";
    } else {
        $("#" + favID).removeClass("is-favorited").addClass("unfavorited");
        $operation = "unfavorite"
    }
    $.ajax({
        url: "set_favorite.php",
        method: "post",
        data: {
            username: Cookies.get("active-user"),
            fav_id: favID.split("-")[1],
            operation: $operation
        },
        success: function (data) {
            //console.log(data);
        },
        error: function (e,f,g) {
            console.log("Something went wrong when trying to favorite the article");
        }
    });
}









