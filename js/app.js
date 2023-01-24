const WeatherApp = {
    appName: 'Weather',

    data: null,
    
    UI: {
        root: null,
        background: null,
        time: null,
        cityName: null,
        description: null,
        temp: null,
        temp__feels_like: null,
        save_location: null,
        icon: null,
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
            this.root = document.querySelector('#root');
            this.background = document.querySelector('#card');
            this.time = document.querySelector('#card__time span');
            this.cityName = document.querySelector('#city-name__text');
            this.description = document.querySelector('#card__description__text');
            this.temp = document.querySelector('#card__temp');
            this.temp__feels_like = document.querySelector('#card__description__feels-like span');
            this.save_location = document.querySelector('#card__save-location');
            this.icon = document.querySelector("#weather-icon span");

            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox button');
        }, 
        
        dynamicBackground(){
            let root = WeatherApp.UI.root;
            let background = WeatherApp.UI.background;
            let time = Number(WeatherApp.data.time.split(':')[0]);
            let t = WeatherApp.data.temp;
            let code = WeatherApp.data.code;

            let classList = "";

            if(code == 800) {
                classList = "clear";
            } else if(code == 801) {
                classList = "few-clouds";
            } else {
                classList = "cloud"
            }

            if(time > 5 && time <= 6) {
                classList += " dawn"
            } else if (time > 6 && time <= 18){
                classList += " day";
            } else if (time > 18 && time < 23){
                classList += " sunset";
            } else if (time === 23 || (time >= 0 && time <= 5)) {
                classList += " night";
            }

            root.classList = classList;
            background.classList = classList;
        },

        update: function(){
            function formatText(text){
                return text[0].toUpperCase() + text.substring(1);
            }

            this.dynamicBackground();

            this.time.innerText = WeatherApp.data.time;
            this.cityName.innerText = WeatherApp.data.city;
            this.description.innerText = formatText(WeatherApp.data.description);
            this.temp.innerText = WeatherApp.data.temp + "°";
            this.temp__feels_like.innerText = WeatherApp.data.temp_feels_like + "°";

            let icon;
            let time = Number(WeatherApp.data.time.split(':')[0]);
            let code = WeatherApp.data.code;

            if(time > 5 && time < 20) {
                switch(code){
                    case 800:
                        icon = "sunny";
                        break;
                    case 801:
                    case 802:
                        icon = "partly_cloudy_day";
                        break;
                    case 803:
                        icon = "cloud";
                        break;
                    case 804:
                        icon = "filter_drama";
                        break;
                }
            } else if (time >= 20 || (time >= 0 && time <= 5)){
                switch(code){
                    case 800:
                        icon = "clear_night";
                        break;
                    case 801:
                    case 802:
                        icon = "nights_stay";
                        break;
                    case 803:
                        icon = "cloud";
                        break;
                    case 804:
                        icon = "filter_drama";
                        break;
                }
            } 

            // rain
            if
            ((code >= 300 && code <= 321) || (code >= 500 && code <= 531)){
                icon = "rainy";
            } else if(code >= 200 && code <= 232){
                icon = "thunderstorm";
            } else if(code >= 600 && code <= 622){
                icon = "cloudy_snowing";
            } else if((code >= 701 && code <= 721) || code == 741){
                icon = "foggy";
            } else if(code == 731 && code == 781){
                icon = 'tornado'
            } 

            this.icon.innerText = icon;
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