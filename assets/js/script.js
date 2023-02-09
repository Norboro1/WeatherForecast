var todayEl = $("#today")
var forecastEl = $("#forecast")

function fetchCurrentWeather(city){
  fetch("http://api.openweathermap.org/data/2.5/weather?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    return response.json();
  })
  .then(function(data){
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
  });
}

function fetchWeatherForecast(city){
  fetch("http://api.openweathermap.org/data/2.5/forecast?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
    var result = data.list.filter(obj => {
      return obj.dt_txt.includes("12:00:00");
    });

    console.log(result);
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

fetchCurrentWeather('Miami');
fetchWeatherForecast('miami');

