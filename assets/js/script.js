var todayEl = $("#today");
var forecastEl = $("#forecast");
var searchInputEl = $("#searchInput");
var searchButtonEl = $("#searchButton");
var searchHistoryEl = $("#searchHistoryDiv");
var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

if(!searchHistory){
  searchHistory = [];
}

function fetchCurrentWeather(city){
  fetch("http://api.openweathermap.org/data/2.5/weather?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    if(response.ok){
      return response.json();
    }
    throw new Error('Invalid City');
  })
  .then(function(data){
    city = city.charAt(0).toUpperCase() + city.slice(1);
    var title = $("<h2 class='m-0 d-flex align-items-center'>");
    var icon = $("<img class='h-100' src='http://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png'>");
    var temp = $("<p class='mt-3 mb-0'>");
    var wind = $("<p class='mt-3 mb-0'>");
    var humidity = $("<p class='mt-3 mb-0'>");
    title.text(city +" ("+dayjs.unix(data.dt).format('M/D/YYYY')+")");
    temp.text("Temp: " + data.main.temp + " \xB0F");
    wind.text("Wind: " + data.wind.speed + " MPH" );
    humidity.text("Humidity: " + data.main.humidity + " %");
    title.append(icon);
    todayEl.append(title);
    todayEl.append(temp);
    todayEl.append(wind);
    todayEl.append(humidity);

    errorCaught = false;
  })
  .catch(function(error){
    console.log(error);
  });
}

function fetchWeatherForecast(city){
  fetch("http://api.openweathermap.org/data/2.5/forecast?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    if(response.ok){
      return response.json();
    }
    throw new Error('Invalid City');
  })
  .then(function(data){
    var result = data.list.filter(obj => {
      return obj.dt_txt.includes("12:00:00");
    });

    for(i in result){
      var card = $("<div class='col-xl-2 my-1 bg-forecast d-flex flex-column py-2 rounded'>");
      var date = $("<h6>");
      var icon = $("<image src='http://openweathermap.org/img/wn/"+result[i].weather[0].icon+"@2x.png'>");
      var temp = $("<p class='mt-0 mb-0'>");
      var wind = $("<p class='mt-3 mb-0'>");
      var humidity = $("<p class='mt-3 mb-0'>");
      date.text(dayjs(result[i].dt_txt).format('M/D/YYYY'));
      temp.text("Temp: " + result[i].main.temp + " \xB0F");
      wind.text("Wind: " + result[i].wind.speed + " MPH");
      humidity.text("Humidity: " + result[i].main.humidity + " %");

      card.append(date, icon, temp, wind, humidity);
      forecastEl.append(card);

    }
  });
}

function loadSearchHistory(){
  searchHistoryEl.empty();
  console.log(searchHistory);
  for(i in searchHistory){
    var historyButton = $("<button class='btn btn-secondary my-2'>");
    historyButton.text(searchHistory[i]);
    searchHistoryEl.append(historyButton);
    console.log(searchHistoryEl);
  }
}

function searchCity(){
  var cityInput = searchInputEl.val();
  if(!cityInput){
    window.alert('Must enter a city name');
    return;
  }
  todayEl.empty();
  forecastEl.empty();

  try {
    fetchCurrentWeather(cityInput);
  } catch (err) {
    console.log(err);
    return;
  }
  /*fetchCurrentWeather(cityInput);
  fetchWeatherForecast(cityInput);

  if(errorCaught){
    window.alert('Could not find weather data for ' + cityInput);
    return;
  } */
  searchHistory.push(cityInput);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  //loadSearchHistory;
}

searchButtonEl.click(searchCity);
searchInputEl.keydown(function(event){
  var key = event.key || event.which || event.keyCode || 0;
  if(key == 'Enter'){
    searchCity();
  }
  
})

fetchCurrentWeather('Miami');
fetchWeatherForecast('miami');
loadSearchHistory();

