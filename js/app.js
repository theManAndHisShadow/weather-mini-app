const WeatherApp = {
    appName: 'Weather',
    
    UI: {
        cityName: null,
        weathercode: null,
        temp: null,
        searchbox: {
            input: null,
            button: null,
        },

        init: function(){
            this.cityName = document.querySelector('#card__city-name');
            this.weathercode = document.querySelector('#card__weathercode'),
            this.temp = document.querySelector('#card__temp');
            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox button');
        }, 

        update: function({city, weathercode, temp} = {}){
            this.cityName.innerText = city;
            this.weathercode.innerText = weathercode;
            this.temp.innerText = temp;
        }
    },

    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },


    init: function(){
        let defaultCity = 'City of London';

        WeatherApp.UI.init();

        WeatherApp.UI.searchbox.button.addEventListener('click', function(){
            let regexp = new RegExp('^' + WeatherApp.UI.searchbox.input.value, "g");
            let searchResults = CITIES_DATA_JSON.filter(city => {return city.name.match(regexp)})
            console.log(searchResults);
            WeatherApp.UI.searchbox.select.innerHTML = "";
            searchResults.forEach(result => {
                WeatherApp.UI.searchbox.select.innerHTML += `<option value="${result.name}">${result.name}, ${result.country}</option>`
            });

            if(searchResults.length > 0){
                API.fetchFor(searchResults[0].name).then(forecast => {

                    WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);
        
                    WeatherApp.UI.update({
                        city: forecast.city,
                        weathercode: forecast.weathercode,
                        temp: forecast.temperature
                    });
        
                    console.log(forecast);
                })
            }
        });

        WeatherApp.UI.searchbox.select.addEventListener('change', function(event){
            let selectedCity = this.value;
            console.log(selectedCity);

            WeatherApp.UI.searchbox.input.value = '';

            API.fetchFor(selectedCity).then(forecast => {
                WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);
    
                WeatherApp.UI.update({
                    city: forecast.city,
                    weathercode: forecast.weathercode,
                    temp: forecast.temperature
                });
    
                console.log(forecast);
            })
        });

        API.fetchFor(defaultCity).then(forecast => {
            WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);

            WeatherApp.UI.update({
                city: forecast.city,
                weathercode: forecast.weathercode,
                temp: forecast.temperature
            });

            console.log(forecast);
        })
    },
};

document.addEventListener("DOMContentLoaded", function(){
    WeatherApp.init();
});