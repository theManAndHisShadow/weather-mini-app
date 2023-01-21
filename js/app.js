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

    updateUI: function(){

    },

    init: function(){
        let defaultCity = 'City of London';

        WeatherApp.UI.init();
        WeatherApp.UI.searchbox.input.addEventListener('keyup', function(){
            let regexp = new RegExp('^' + WeatherApp.UI.searchbox.input.value, "g");
            let result = CITIES_DATA_JSON.filter(city => {return city.name.match(regexp)})
            console.log(result);
        });

        WeatherApp.UI.searchbox.button.addEventListener('click', function(){
            API.fetchFor(WeatherApp.UI.searchbox.input.value).then(forecast => {
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

