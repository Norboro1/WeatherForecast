//Declare element variables to edit with jQuery.
var todayEl = $("#today");
var forecastEl = $("#forecast");
var searchInputEl = $("#searchInput");
var searchButtonEl = $("#searchButton");
var searchHistoryEl = $("#searchHistoryDiv");
var clearHistoryButton = $("#clearHistory");
//Declare empty variable to search history, try to get history from local storage, if error or empty sets to empty array
var searchHistory;
 try{ 
  searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
} catch {
  searchHistory = [];
}
if(!searchHistory){
  searchHistory = [];
}

//Fetch current weather data from openweathermap API using city name
function fetchCurrentWeather(city){
  fetch("https://api.openweathermap.org/data/2.5/weather?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f",{mode: 'cors'})
  .then(function(response){
    if(response.ok){
      return response.json();
    }
    //Throw error if no results come back, meaning city name didn't match anything.
    throw new Error('Invalid City');
  })
  //Build elements to display current weather data from results and then show the element for todays weather
  .then(function(data){
    todayEl.empty();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    var title = $("<h2 class='m-0 d-flex align-items-center'>");
    var icon = $("<img class='h-100' src='http://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png'>");
    var temp = $("<p class='mt-3 mb-0'>");
    var wind = $("<p class='mt-3 mb-0'>");
    var humidity = $("<p class='mt-3 mb-0'>");
    //using dayjs to display date of weather data formatted to my liking.
    title.text(city +" ("+dayjs.unix(data.dt).format('M/D/YYYY')+")");
    temp.text("Temp: " + data.main.temp + " \xB0F");
    wind.text("Wind: " + data.wind.speed + " MPH" );
    humidity.text("Humidity: " + data.main.humidity + " %");
    title.append(icon);
    todayEl.append(title);
    todayEl.append(temp);
    todayEl.append(wind);
    todayEl.append(humidity);

    todayEl.show();
    //Catches error here and logs it
  }).catch(function(err){
    console.log(err);
  });
}

//fetch Weather forecast data from openweathermap API using city name
function fetchWeatherForecast(city){
  fetch("https://api.openweathermap.org/data/2.5/forecast?q="
  +city
  +"&units=imperial&appid=b2cfe1b8ffa682255c888dba9472cb1f",{mode: 'cors'})
  .then(function(response){
    if(response.ok){
      return response.json();
    }
    //similar to previous fetch function
    throw new Error('Invalid City');
  })
  //build elements to display forecast data from response 
  .then(function(data){  
    forecastEl.empty();
    //Since the fetch returns data for every 3 hours for 5 days, this filter is to include only the data from noon each day.
    var result = data.list.filter(obj => {
      return obj.dt_txt.includes("12:00:00");
    });
    //For loop to build a card displaying the weather data for each day in the forecast (filtered to simplify above)
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
    forecastEl.parent().show();
    //The following code up to the catch statement was placed here to prevent failed searches from showing up in the history.
    //I initially wanted to have the page load with results from a default city, but WITHOUT storing that city in search history. I'm sure I could have accomplished this
    //using asynchronous functions, but I could not figure it out as we haven't touched on that yet.

    //Checks search history for matching searches (not case sensitive) and deletes it from history before re-adding new search to history. This prevents duplicates and keeps history
    //in order of recent -> least recent.
    for(i in searchHistory){
      if(city.toUpperCase() == searchHistory[i].toUpperCase()){
        searchHistory.splice(i, 1);
      }
    }
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    loadSearchHistory();
    //catch error and display alert that weather data was not found.
  }).catch(function(err){
    console.log(err);
    window.alert('Could not find weather data for ' + city);
  });
}

//Loads search history by generating buttons with a for loop.
function loadSearchHistory(){
  searchHistoryEl.empty();
  //loops through search history backwards to display most recent searches at the top. Probably could have just made the parent element flex-direction to column-reverse.
  for(i in searchHistory){
    var historyButton = $("<button class='btn btn-secondary my-2'>");
    historyButton.text(searchHistory[searchHistory.length-i-1]);
    searchHistoryEl.append(historyButton);
  }
}

//Runs fetch functions using input from search bar and then clears the search bar.
function searchCity(){
  //get input from search bar, alert and return from function if empty.
  var cityInput = searchInputEl.val();
  if(!cityInput){
    window.alert('Must enter a city name');
    return;
  }

  fetchCurrentWeather(cityInput);
  fetchWeatherForecast(cityInput);
  searchInputEl.val('');
}

//Event listeners to run searchCity function upon either clicking the search button or pressing the Enter key while the input is in focus.
searchButtonEl.click(searchCity);
searchInputEl.keydown(function(event){
  var key = event.key || event.which || event.keyCode || 0;
  if(key == 'Enter'){
    searchCity();
  }
  
});

//Event listener for search history buttons to run fetch functions using the text content of the buttons.
searchHistoryEl.on('click', 'button', function(){
  fetchCurrentWeather($(this).text());
  fetchWeatherForecast($(this).text());
});

//Event listener for Clear History button to clear the history variable and local storage, and then reload the history element.
clearHistoryButton.click(function(){
  searchHistory = [];
  localStorage.setItem('searchHistory', searchHistory);
  loadSearchHistory();
})

//Hide the current weather and forecast elements by default and load search history
todayEl.hide();
forecastEl.parent().hide();
loadSearchHistory();

