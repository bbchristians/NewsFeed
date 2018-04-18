var GET_WEATHER_LIST = "http://www.se.rit.edu/~swen-344/activities/rest/RESTAPI-Weather.php?action=get_weather_list";
const GET_SECRET_KEY = "http://www.se.rit.edu/~swen-344/activities/rest/RESTAPI-Weather.php?action=get_secret_key";
var GET_WEATHER = "http://www.se.rit.edu/~swen-344/activities/rest/RESTAPI-Weather.php?action=get_weather&key=";
const GET_WEATHER_ZIP_CODE = "&zip=";
var key_asd = "";
const xhr = new XMLHttpRequest();
const xhr_key = new XMLHttpRequest();
function create_selections() {
  
  xhr_key.open('GET', GET_SECRET_KEY);
  
  xhr_key.onload = function() {
    GET_WEATHER_LIST += "&key="
    const response = JSON.parse(xhr_key.responseText);
    Object.keys(response).map(function(key) {
      key_asd = response[key];
      GET_WEATHER_LIST += response[key];
    });
    
    xhr.open('GET', GET_WEATHER_LIST);
    xhr.onload = function() {
      const response = JSON.parse(xhr.responseText);
      // create an array of trs that will be added to the page
      const trs = Object.keys(response).map(function(key) {
        const right = document.createElement('td');
        right.innerText = response[key].zip;
        right.setAttribute("onclick", "show_weather(" + response[key].zip + ")");
        
        const tr = document.createElement('tr');
        tr.appendChild(right);
        return tr;
      });
      // create a table and add the rows
      const table = document.createElement('table');
      trs.forEach(function(tr) {
        table.appendChild(tr);
      });
      const container = document.getElementById('zip-info');
      // remove any existing child if it exists
      container.appendChild(table);
    }
    xhr.send();
  }
  xhr_key.send();
}

function show_weather(zip) {
  xhr_zip = new XMLHttpRequest();
  var url = GET_WEATHER + key_asd + GET_WEATHER_ZIP_CODE + zip;
    
  xhr_zip.open('GET', url);
  
  xhr_zip.onload = function() {
    const response = JSON.parse(xhr_zip.responseText);
    
    const name = document.createElement('p');
    name.innerText = response.name;
    
    const zip = document.createElement('p');
    zip.innerText = response.zip;
    
    const forecast = document.createElement('p');
    forecast.innerText = response.forecast;
    
    const img = document.createElement('img');
    img.setAttribute("src", response.image);
    
    const fin = document.createElement('div');
    fin.appendChild(name);
    fin.appendChild(zip);
    fin.appendChild(forecast);
    fin.appendChild(img);
    
    const container = document.getElementById('specific-zip-info');
    
    if (container.firstChild) {
      container.removeChild(container.firstChild); 
    }
    
    container.appendChild(fin);
  }
  xhr_zip.send();
}