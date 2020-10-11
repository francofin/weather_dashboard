var api = "fa97e6e43217426928e8bfb8c6a5a48c";
var defaultCity = "Toronto";
var formEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var search = document.querySelector("#search-city");
var searchDate = document.querySelector("#search-date");
var cityContainerEl = document.querySelector("#city-container");
var forecastContainer = document.querySelector("#forecast-content");
var savedSearches = document.querySelector("#recently-viewed");
var searches = [];

var saveSearches = function(city) {
    if (searches.includes(city)) {
        return;
    }
    else {
        searches.push(city);
        localStorage.setItem("Search", JSON.stringify(searches));
    };
    
};


var displayWeather = function(weather, searchCity) {
    if(weather) {
        search.textContent = searchCity;
        var date = weather.dt;
        var current_time = moment.unix(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
        searchDate.textContent = current_time;
    }

   



    var coordinates = weather.coord;
    var long = coordinates.lon;
    var lat = coordinates.lat;


    var jumbotron = document.createElement("div");
    jumbotron.classList = "jumbotron";
    var search_city = weather.name;
    var cityName = document.createElement("h1");
    cityName.classList = "display-4";
    cityName.textContent = search_city;
    jumbotron.appendChild(cityName);

    var data = weather.main;
    var dataContainer = document.createElement("ul");
    dataContainer.classList = "list-group list-group-flush";

    var tempContainer = document.createElement("li");
    tempContainer.classList = "list-group-item";
    tempContainer.textContent = "Temperature : " + data.temp + " F";
    dataContainer.appendChild(tempContainer);

    var humidContainer = document.createElement("li");
    humidContainer.classList = "list-group-item";
    humidContainer.textContent = "Humidity : " + data.humidity + "%";
    dataContainer.appendChild(humidContainer);

    var feelsContainer = document.createElement("li");
    feelsContainer.classList = "list-group-item";
    feelsContainer.textContent = "Feels Like : " + data.feels_like + " F";
    dataContainer.appendChild(feelsContainer);

    var windContainer = document.createElement("li");
    windContainer.classList = "list-group-item";
    windContainer.textContent = "Wind Speed : " + weather.wind.speed + " MPH";
    dataContainer.appendChild(windContainer);

    var uv = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + long + "&exclude=hourly,daily&appid=" + api;
    fetch(uv).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var uvContainer = document.createElement("li");
                var uvtextcontent = data.current.uvi;
                if (uvtextcontent < 4 ){
                    uvContainer.classList = "list-group-item list-group-item-success";
                    uvContainer.textContent = "UV Index : " + data.current.uvi;
                }
                else if (uvtextcontent > 4 && uvtextcontent < 8) {
                    uvContainer.classList = "list-group-item list-group-item-primary";
                    uvContainer.textContent = "UV Index : " + data.current.uvi;
                }
                else if (uvtextcontent >8) {
                    uvContainer.classList = "list-group-item list-group-item-danger";
                    uvContainer.textContent = "UV Index : " + data.current.uvi;
                }
                
                dataContainer.appendChild(uvContainer);
            })
        }
    })

    jumbotron.appendChild(dataContainer);

    cityContainerEl.appendChild(jumbotron);

    
}

var getForecast = function(forecast) {
    var coordinates = forecast.coord;
    var long = coordinates.lon;
    var lat = coordinates.lat;
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + long + "&exclude=hourly,minutely&appid=" + api;

    fetch(forecastUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var forecasts = data.daily;
                var forecasts2 = data.current;

                
                for(var i =0; i < 5; i++) {
                    
                    var col = document.createElement("div");
                    col.classList = "col-sm-2";


                    var card_body = document.createElement("div");
                    card_body.classList = ("card text-white bg-primary mb-3");
                    var datalist = document.createElement("ul");

                    var icon = document.createElement("img");
                    icon.setAttribute("src", "http://openweathermap.org/img/w/"+forecasts[i].weather[0].icon+".png");
                    icon.classList = "card-img-top";
                    card_body.appendChild(icon);

                    var date = document.createElement("p");
                    date.style.color = "white";
                    date.style.fontSize = "16px";
                    date.textContent = moment.unix(forecasts[i].dt).format("ddd, MMM YYYY");
                    datalist.appendChild(date);

                    var temp = document.createElement("p");
                    temp.style.color = "white";
                    temp.style.fontSize = "16px";
                    temp.textContent ="Temp: "+ forecasts2.temp + " F";
                    datalist.appendChild(temp);

                    var humid = document.createElement("p");
                    humid.style.color = "white";
                    humid.style.fontSize = "16px";
                    humid.textContent ="Humidity: "+ forecasts2.humidity + "%";
                    datalist.appendChild(humid);


                   

                    card_body.appendChild(datalist);
                    col.appendChild(card_body);

                    forecastContainer.appendChild(col);
                    console.log(data);
                }
            })
        }
    })
    
}

var load_searches = function() {
    searches = localStorage.getItem("Search");
    if(!searches) {
        searches = [];
        return false;
      };
    searches = JSON.parse(searches);
    var searchList = document.createElement("ul");
    searchList.classList = "list-group";
    for (var i = 0; i<searches.length; i++) {
        
        var search_item = document.createElement("button");
        search_item.classList = "list-group-item list-group-item-action";
        search_item.setAttribute("search", searches[i]);
        search_item.setAttribute("type", "submit");
        search_item.textContent = searches[i];
        searchList.appendChild(search_item)
    }
    savedSearches.appendChild(searchList);

};

var load_saved_search = function(event) {

    var targetEl = event.target;
    var city = targetEl.getAttribute("search");
    cityContainerEl.textContent = "";
    forecastContainer.textContent = "";
    getWeather(city);
    
};


var getWeather = function(city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+ city + "&units=metric&appid=" + api;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
           response.json().then(function(data) {
               displayWeather(data, city);
               getForecast(data);
               saveSearches(city);
               console.log(data);
           })
        }
    })
};


var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();

    if (city) {
        getWeather(city);
        
    
        cityInputEl.value = "";
        cityContainerEl.textContent = "";
        forecastContainer.textContent = "";
        
    }
};



formEl.addEventListener("submit", formSubmitHandler);
load_searches();
savedSearches.addEventListener("click", load_saved_search);
