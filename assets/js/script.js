function fetchCurrentWeather(){
  fetch("http://api.openweathermap.org/data/2.5/weather?q=miami&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
  });
}

function fetchWeatherForecast(){
  fetch("http://api.openweathermap.org/data/2.5/forecast?q=miami&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f")
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
    var result = data.list.filter(obj => {
      return obj.dt_txt.includes("12:00:00");
    });

    console.log(result);
  });
}

fetchCurrentWeather();
fetchWeatherForecast();