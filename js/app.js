const WeatherApp = {
    appName: 'Weather',

    data: null,
    
    UI: {
        colors: {
            warm: [
                [232, 169, 50],
                [233, 102, 28],
            ],
        },
        time: null,
        cityName: null,
        description: null,
        temp: null,
        temp__feels_like: null,
        save_location: null,
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
            this.time = document.querySelector('#card__time span');
            this.cityName = document.querySelector('#city-name__text');
            this.description = document.querySelector('#card__description__text');
            this.temp = document.querySelector('#card__temp');
            this.temp__feels_like = document.querySelector('#card__description__feels-like span');
            this.save_location = document.querySelector('#card__save-location');

            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox button');
        }, 

        update: function(){
            function formatText(text){
                return text[0].toUpperCase() + text.substring(1);
            }
            this.time.innerText = WeatherApp.data.time;
            this.cityName.innerText = WeatherApp.data.city;
            this.description.innerText = formatText(WeatherApp.data.description);
            this.temp.innerText = WeatherApp.data.temp + "°";
            this.temp__feels_like.innerText = WeatherApp.data.temp_feels_like + "°";
        }
    },

    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },


    init: function(){
        let defaultLocation = localStorage.getItem('defaultLocation') || '{"lon":35.9208,"lat":56.8587}';

        defaultLocation = JSON.parse(defaultLocation);

        WeatherApp.UI.init();

        API.weather.now(defaultLocation.lat, defaultLocation.lon).then(weather => {
            WeatherApp.data = weather;

            WeatherApp.changeTabName(weather.city + ', ' + weather.country);
            WeatherApp.UI.update();
        });

        WeatherApp.UI.save_location.addEventListener('click', function(){
            localStorage.setItem('defaultLocation', JSON.stringify(WeatherApp.data.coordinates));
        });

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

                        WeatherApp.data = weather;

                        WeatherApp.changeTabName(weather.city + ', ' + weather.country);
                        WeatherApp.UI.update();
                    });
                }
            });
        });

        WeatherApp.UI.searchbox.select.addEventListener('change', function(event){
            let selectedCity = JSON.parse(this.value);

            API.weather.now(selectedCity.lat, selectedCity.lon).then(weather => {
                console.log(weather);

                WeatherApp.data = weather;
                
                WeatherApp.changeTabName(weather.city + ', ' + weather.country);
                WeatherApp.UI.update();
            });
        });
    },
};

document.addEventListener("DOMContentLoaded", function(){
    WeatherApp.init();
});