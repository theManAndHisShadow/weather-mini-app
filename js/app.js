const WeatherApp = {
    appName: "Weather Mini App",

    // show or hide request result in console
    debug: false,

    // Using for save last request data
    data: null,
    


    // UI elements and own methods object
    UI: {
        // Root node of application (html => body => #app => #root)
        root: null,

        // weather app node dsiplays as little card
        card: null,

        // node with local time
        time: null,

        // node with city name
        cityName: null,

        // node with weather descr.
        description: null,

        // node with current temperature
        temp: null,
        temp__feels_like: null,

        // node with button 'save location'
        save_location: null,

        // weather icon (rain, sun, cloud etc.)
        icon: null,

        // searchbox object
        searchbox: {
            // here user input city name
            input: null,

            // searching by city name returns options... 
            // ...for this select node
            select: null,

            // node to start search action
            button: null,

            /**
             * Fills 'selec't node with 'option' nodes
             * @param {string} country 
             * @param {string} city 
             * @param {number|string} latitude 
             * @param {number|string} longitude 
             */
            createSelectOptions: function(country, city, latitude, longitude){
                this.select.innerHTML += `<option value='{"lat":"${latitude}","lon":"${longitude}"}'>${city}, ${country}</option>`
            },



            /**
             * Clear input field
             */
            clear: function(){
                this.select.innerHTML = "";
            },
        },



        // Animated spinner element
        spinner: {
            node: null,

            /**
             * Hide spinner node only once
             */
            hideOnce: function(){
                if(!this.node.classList.contains('transparent')){
                    setTimeout(() => {
                        this.node.classList.add('transparent');
                    }, 350)
                }
            },
        },



        /**
         * Initialize UI node props
         */
        init: function(){
            // basement
            this.root = document.querySelector('#root');
            this.spinner.node = document.querySelector('#loading-spinner');
            this.card = document.querySelector('#card');

            // searchbox
            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox label span');

            // card
            this.time = document.querySelector('#card__time span');
            this.save_location = document.querySelector('#card__save-location');
            this.cityName = document.querySelector('#city-name__text');
            this.icon = document.querySelector("#weather-icon span");
            this.description = document.querySelector('#card__description__text');
            this.temp = document.querySelector('#card__temp');
            this.temp__feels_like = document.querySelector('#card__description__feels-like span');
        }, 
        


        /**
         * App colors changing by weather data and local time
         */
        changeColors(){
            let root = WeatherApp.UI.root;
            let background = WeatherApp.UI.card;
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



        /**
         * Change 'save location' button visibility using WeatherApp.getDefaultLocation() result
         */
        showOrHideSaveLocation: function(){
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
        },
        


        /**
         * Change weather icon by weather data and time
         */
        changeWeatherIcon: function(){
            let icon;
            let time = Number(WeatherApp.data.time.split(':')[0]);
            let code = WeatherApp.data.code;

            // if day
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
            // if night
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

            // Not depends by local time
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
        },



        /**
         * Rendering the user interface using the current data. 
         * All UI mutations happens here!
         */
        update: function(){
            // helper function should not be here ;)
            function formatText(text){
                return text[0].toUpperCase() + text.substring(1);
            }

            WeatherApp.UI.spinner.hideOnce();
            WeatherApp.UI.showOrHideSaveLocation();
            WeatherApp.UI.changeColors();
            WeatherApp.UI.changeWeatherIcon();

            this.time.innerText = WeatherApp.data.time;
            this.cityName.innerText = WeatherApp.data.city;
            this.description.innerText = formatText(WeatherApp.data.description);
            this.temp.innerText = WeatherApp.data.temp + "°";
            this.temp__feels_like.innerText = WeatherApp.data.temp_feels_like + "°";
        }
    },



    /**
     * Get saved data about default location
     * @returns Object with default location latitude and longitude
     */
    getDefaultLocation(){
        return JSON.parse(localStorage.getItem('defaultLocation'));
    },



    /**
     * Upodate browser tab title
     * @param {string} text 
     */
    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },



    /**
     * Get and update weather for some city
     * @param {string|number} lat target city latitude
     * @param {string|number} lon target city longitude
     */
    updateFor: function(lat, lon){
        API.weather.now(lat, lon).then(weather => {
            if(WeatherApp.debug){
                console.log(weather);
            }

            // save new weather data
            WeatherApp.data = weather;

            // update tab name
            WeatherApp.changeTabName(weather.city + ', ' + weather.country);

            // render all UI
            WeatherApp.UI.update();
        });
    },



    /**
     * Get user search value, find city and if successful - update UI with new data
     */
    locateAndUpdate: function(){
        let inputValue = WeatherApp.UI.searchbox.input.value;
            
        if(inputValue.length > 0) {
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

                // if we result > 0, render data for first location
                if(locations.length > 0) {
                    WeatherApp.changeTabName(locations[0].name + ', ' + locations[0].country);
                    WeatherApp.updateFor(locations[0].lat, locations[0].lon);

                    // NB: this only UI mutation outside WeatherApp.UI.update
                    // unhide select elemen, if locations array length > 0
                    WeatherApp.UI.searchbox.select.removeAttribute('hidden');
                } else {
                    // NB: this only UI mutation outside WeatherApp.UI.update
                    // unhide select elemen, if locations array length =< 0
                    WeatherApp.UI.searchbox.select.setAttribute('hidden', '');
                }
            });
        }
    },



    /**
     *   
     * Initialize entire application
     * @param {*} param0 Show request results in console
     */
    init: function({debug = false} = {}){
        WeatherApp.UI.init();
        
        // show weather fo default location
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
    WeatherApp.init({debug: true});
});