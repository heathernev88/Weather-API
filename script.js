let searchButton = document.getElementById("searchBtn");
let today = moment().format("M/D/YYYY");
let apiKey = "1e1e5129ac0d1cdee405db19d8000ee9";
let cityNameSearch = document.getElementById("cityInput");
let searchHistory = [];
let cityButtons = document.querySelector(".btn-group-vertical");

function saveLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};


function populateHistoryButtons() {

    $(".btn-group-vertical").empty();
    let recentSearches = searchHistory.reverse();
    let ul = $(".btn-group-vertical")
    
    for (let i = 0; i < recentSearches.length; i++) {

        let capitalizeCity = recentSearches[i].charAt(0).toUpperCase() + recentSearches[i].slice(1)
        let newButtons = $(`<li  class="btn" data-city="${recentSearches[i]}" id="cityBtn">${capitalizeCity}</li>`);

        newButtons.on("click", function (event) {
            event.preventDefault();
            let cityBtn = $(this).data("city");
            callApiCity(cityBtn);
        })

        ul.append(newButtons);

    }

}

function callApiCity(city) {

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        
        let name = (response.name);
        let iconCode = response.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";


        let date = $(".city").html("<h1>" + response.name + " (" + today + ")" + "</h1>");
        date.append($("#weatherIcon").attr("src", iconURL));
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
        var tempCalc = (response.main.temp - 273.15) * 1.8 + 32;
        $(".temp").text("Temperature: " + tempCalc.toFixed(0) + "°F");

        let latitude = (response.coord.lat);
        let longitude = (response.coord.lon);
        uvApi(apiKey, latitude, longitude);
        forecast(apiKey, latitude, longitude);
    });

};

function uvApi(apiKey, latitude, longitude) {
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`,
        method: "GET"
    }).then(function (response) {
        $(".uv-index").text("UV Index: " + response.value);

        if (response.value === 0 && response.value < 2) {
            $(".uv-index").addClass("green");
        }

        if (response.value >= 2 && response.value < 6) {
            $(".uv-index").addClass("yellow");
        }

        if (response.value >= 6 && response.value < 8) {
            $(".uv-index").addClass("orange");
        }

        if (response.value >= 8) {
            $(".uv-index").addClass("red");
        }

    })
};


function forecast(apiKey, latitude, longitude) {

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
            exclude=minutely,current,hourly&appid=${apiKey}`,
        method: "GET"
    }).then(function (response) {
        
        $(".fiveDay").empty();

        for (i = 1; i < 6; i++) {
            let fiveDayTemp = parseInt(((response.daily[i].temp.day - 273.15) * 1.8 + 32));

            let icon = (response.daily[i].weather[0].icon);
            let forecastIconURL = `http://openweathermap.org/img/w/${icon}.png`;
            let humidity = response.daily[i].humidity;

            let date = moment.unix(response.daily[i].dt).format('MM/DD/YY');


            $('.fiveDay').append(
                `<div class='weather-icon'><h3>${date}</h3>
                    <img src="${forecastIconURL}">
                    <h3>Temp: ${fiveDayTemp}\xB0F 
                    Humidity: ${humidity}%</h3></div>`);

        }

    })

};

function initialize() {
    
    searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

    searchButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (cityNameSearch.value.length < 1) return;

        let cityIndex = searchHistory.indexOf(cityNameSearch.value);
        callApiCity(cityNameSearch.value);

        if (cityIndex !== -1) {
            searchHistory.splice(cityIndex, 1);
        }

        searchHistory.push(cityNameSearch.value);
        populateHistoryButtons();

        saveLocalStorage("cities", searchHistory);

    });
    populateHistoryButtons();
};

$(document).ready(function () {
    initialize();
});

