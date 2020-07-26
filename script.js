
let citySearch = document.getElementById("citySearch");
let cityName = citySearch.value;
let apiKey = "1e1e5129ac0d1cdee405db19d8000ee9";
let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${ cityName }&appid=${ apiKey }`;
// var tempF = (response.main.temp - 273.15) * 1.80 + 32; calculations to convert to fahrenheit

$.ajax({
    url: queryURL,
    method: "GET",
}).then(function(response) {
    console.log(response)
});





