var searchHistory = JSON.parse(localStorage.getItem("retrieveAPI")) || [];

for (let i = 0; i < searchHistory.length; i++) {
    var historyBtn = document.createElement("button")
    historyBtn.textContent = searchHistory[i]
    historyBtn.addEventListener("click", function () {
        var city = (searchHistory[i])
        document.getElementById("city").value = city
        retrieveAPI()
    })
    document.getElementById("history").append(historyBtn)
}
var fetchButton = document.getElementById('fetch-city')
$(document).ready(function () {
    var weatherClock = function () {
        var presentClock = moment().format('[Today], dddd MMMM Do YYYY h:mm:ss a')
        $("#presentDay").text(presentClock)
    }
    setInterval(weatherClock, 1000)
})

function retrieveAPI() {
    var city = document.getElementById("city").value
    console.log(city)
    if(!searchHistory.includes(city)){
        searchHistory.push(city)
    }
    localStorage.setItem('retrieveAPI', JSON.stringify(searchHistory));
    var requestSite = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=cf1929056b460b4693a80b30482c21ed&units=imperial'

    fetch(requestSite)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data)
            var forecastListEl = document.getElementById("js-forecast-list")
            forecastListEl.innerHTML = ""
            for (let i = 0; i < 5; i++) {
                renderForecastCard(data.list[i], i)
            }

            var lon = data.city.coord.lon
            var lat = data.city.coord.lat
            var requestNew = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=cf1929056b460b4693a80b30482c21ed&units=imperial'

            fetch(requestNew)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var forecastListE0 = document.getElementById("weather")
                    forecastListE0.innerHTML = ""
                    renderOriginForecastCard(data)
                    console.log(data)


                })

        })
}

function renderOriginForecastCard(todayWeather) {
    console.log(todayWeather)
    var dayOne = moment().format("MMM Do YY")
    var forecastListE0 = document.getElementById("weather")
    var cardOneHTML = `
<div class="card">
  <div class="card-body">
  <p class="card-text">${dayOne}</p>
  <p class="card-text">${document.getElementById("city").value}</p>
  <img class="card-title"src=${"http://openweathermap.org/img/wn/"+todayWeather.weather[0].icon+"@2x.png"}
    <p class="card-text">temp: ${todayWeather.main.temp}</p>
    <p class="card-text">wind speed: ${todayWeather.wind.speed}</p>
    <p class="card-text">wind gust: ${todayWeather.wind.gust}</p>
    <p class="card-text">humidity: ${todayWeather.main.humidity}</p>
  </div>
</div>
`
    var listItemOne = document.createElement("li")
    listItemOne.innerHTML = cardOneHTML
    forecastListE0.appendChild(listItemOne)
}
function renderForecastCard(weatherObject, i) {
    console.log(weatherObject)
    var dayNext = moment().add(i + 1, 'days').format("MMM Do YY")
    var forecastListEl = document.getElementById("js-forecast-list")
    var cardHTML = `
<div class="card">
  <div class="card-body">
  <p class="card-text">${dayNext}</p>
  <p class="card-text">${document.getElementById("city").value}</p>
    <img class="card-title"src=${"http://openweathermap.org/img/wn/"+weatherObject.weather[0].icon+"@2x.png"}>
    <p class="card-text">temp: ${weatherObject.main.temp}</p>
    <p class="card-text">wind speed: ${weatherObject.wind.speed}</p>
    <p class="card-text">wind gust: ${weatherObject.wind.gust}</p>
    <p class="card-text">humidity: ${weatherObject.main.humidity}</p>
  </div>
</div>
`
    var listItem = document.createElement("li")
    listItem.innerHTML = cardHTML
    forecastListEl.appendChild(listItem)
}



fetchButton.addEventListener('click', retrieveAPI)