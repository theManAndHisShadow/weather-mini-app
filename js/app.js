const WeatherApp = {
    appName: 'Weather',
    
    UI: {
        cityName: null,
        description: null,
        temp: null,
        temp__feels_like: null,
        searchbox: {
            input: null,
            select: null,
            button: null,

            createSelectOptions: function(country, city, latitude, longitude){
                this.select.innerHTML += `<option value='{"lat":"${latitude}","lon":"${longitude}"}'>${city}, ${country}</option>`
            },

            clear: function(){
                this.select.innerHTML = "";
            },
        },

        init: function(){
            this.cityName = document.querySelector('#card__city-name');
            this.description = document.querySelector('#card__description'),
            this.temp = document.querySelector('#card__temp');
            this.temp__feels_like = document.querySelector('#card__temp-feels-like');
            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox button');
        }, 

        update: function({city, description, temp, temp_feels_like} = {}){
            this.cityName.innerText = city;
            this.description.innerText = description;
            this.temp.innerText = temp;
            this.temp__feels_like.innerText = temp_feels_like
        }
    },

    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },


    init: function(){
        let defaultCity = {"lat":"51.5073219","lon":"-0.1276474"};

        WeatherApp.UI.init();

        WeatherApp.UI.searchbox.button.addEventListener('click', function(){
            let inputValue = WeatherApp.UI.searchbox.input.value;
            
            API.geo.locate(inputValue).then(locations => {
                WeatherApp.UI.searchbox.clear();

                locations.forEach(result => {
                    WeatherApp.UI.searchbox.createSelectOptions(
                        result.country,
                        result.name,
                        result.lat,
                        result.lon
                    )
                });

                if(locations.length > 0) {
                    WeatherApp.changeTabName(locations[0].name + ', ' + locations[0].country);
                    API.weather.now(locations[0].lat, locations[0].lon).then(weather => {
                        console.log(weather);
                        WeatherApp.UI.update({
                            city: weather.city,
                            description: weather.description,
                            temp: weather.temp,
                            temp_feels_like: weather.temp_feels_like,
                        });
                    });
                }
            });
        });

        WeatherApp.UI.searchbox.select.addEventListener('change', function(event){
            let selectedCity = JSON.parse(this.value);

            API.weather.now(selectedCity.lat, selectedCity.lon).then(weather => {
                WeatherApp.changeTabName(weather.city + ', ' + weather.country);

                console.log(weather);
                WeatherApp.UI.update({
                    city: weather.city,
                    description: weather.description,
                    temp: weather.temp,
                    temp_feels_like: weather.temp_feels_like,
                });
            });
        });

        API.weather.now(defaultCity.lat, defaultCity.lon).then(weather => {
            WeatherApp.changeTabName(weather.city + ', ' + weather.country);

            WeatherApp.UI.update({
                city: weather.city,
                description: weather.description,
                temp: weather.temp,
                temp_feels_like: weather.temp_feels_like,
            });

        });
    },
};

document.addEventListener("DOMContentLoaded", function(){
    WeatherApp.init();
});