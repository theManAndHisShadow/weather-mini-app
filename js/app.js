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


        spinner: {
            node: null,

            hideOnce: function(){
                if(!this.node.classList.contains('transparent')){
                    setTimeout(() => {
                        this.node.classList.add('transparent');
                    }, 350)
                }
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
            this.spinner.node = document.querySelector('#loading-spinner')

            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox label span');
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


            WeatherApp.UI.spinner.hideOnce();
            
            let currentLocation = WeatherApp.data.coordinates;
            let defaultLocation = WeatherApp.getDefaultLocation();
            if(
                (currentLocation.lat === defaultLocation.lat) 
                && 
                (currentLocation.lon === currentLocation.lon)
            ) {
                WeatherApp.UI.save_location.classList.remove('opacity-low');
            } else {
                WeatherApp.UI.save_location.classList.add('opacity-low');
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

    getDefaultLocation(){
        return JSON.parse(localStorage.getItem('defaultLocation'));
    },

    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },


    updateFor: function(lat, lon){
        API.weather.now(lat, lon).then(weather => {
            console.log(weather);

            WeatherApp.data = weather;
            WeatherApp.changeTabName(weather.city + ', ' + weather.country);
            WeatherApp.UI.update();
        });
    },

    locateAndUpdate: function(){
        let inputValue = WeatherApp.UI.searchbox.input.value;
            
            API.geo.locate(inputValue).then(locations => {
                WeatherApp.UI.searchbox.clear();

                locations.forEach(result => {
                    WeatherApp.UI.searchbox.createSelectOptions(
                        result.country,
                        result.name,
                        result.lat,
                        result.lon
                    );
                });

                if(locations.length > 0) {
                    WeatherApp.changeTabName(locations[0].name + ', ' + locations[0].country);

                    // default action when locations finded...
                    // ...show weather for first location
                    WeatherApp.updateFor(locations[0].lat, locations[0].lon);

                    WeatherApp.UI.searchbox.select.removeAttribute('hidden');
                } else {
                    WeatherApp.UI.searchbox.select.setAttribute('hidden', '');
                }
            });
    },


    init: function(){
        WeatherApp.UI.init();
        
        let defaultLocation = 
                WeatherApp.getDefaultLocation()
                || '{"lon":35.9208,"lat":56.8587}';

        WeatherApp.updateFor(defaultLocation.lat, defaultLocation.lon);

        WeatherApp.UI.save_location.addEventListener('click', function(){
            localStorage.setItem('defaultLocation', JSON.stringify(WeatherApp.data.coordinates));
            this.classList.remove('opacity-low');
        });

        WeatherApp.UI.searchbox.button.addEventListener('click', function(){
            WeatherApp.locateAndUpdate();
        });

        WeatherApp.UI.searchbox.input.addEventListener('keydown', function(event){
            if(event.key == "Enter"){
                WeatherApp.locateAndUpdate();
            }
        });

        WeatherApp.UI.searchbox.select.addEventListener('change', function(){
            let selectedCity = JSON.parse(WeatherApp.UI.searchbox.select.value);
            WeatherApp.updateFor(selectedCity.lat, selectedCity.lon);
        });

    },
};

document.addEventListener("DOMContentLoaded", function(){
    WeatherApp.init();
});