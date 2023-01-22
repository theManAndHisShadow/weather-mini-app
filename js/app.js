const WeatherApp = {
    appName: 'Weather',
    
    UI: {
        cityName: null,
        description: null,
        temp: null,
        searchbox: {
            input: null,
            button: null,
        },

        init: function(){
            this.cityName = document.querySelector('#card__city-name');
            this.description = document.querySelector('#card__description'),
            this.temp = document.querySelector('#card__temp');
            this.searchbox.input = document.querySelector('#searchbox input'),
            this.searchbox.select = document.querySelector('#searchbox select'),
            this.searchbox.button = document.querySelector('#searchbox button');
        }, 

        update: function({city, description, temp} = {}){
            this.cityName.innerText = city;
            this.description.innerText = description;
            this.temp.innerText = temp;
        }
    },

    changeTabName: function(text){
        document.title = WeatherApp.appName + ' - ' + text;
    },


    init: function(){
        let defaultCity = [51.51279, -0.09184];

        WeatherApp.UI.init();

        WeatherApp.UI.searchbox.button.addEventListener('click', function(){
            let regexp = new RegExp('^' + WeatherApp.UI.searchbox.input.value, "g");
            let searchResults = CITIES_DATA_JSON.filter(city => {return city.name.match(regexp)})
            console.log(searchResults);
            WeatherApp.UI.searchbox.select.innerHTML = "";
            console.log(searchResults);
            searchResults.forEach(result => {
                WeatherApp.UI.searchbox.select.innerHTML += `<option value="${result.latitude},${result.longitude}">${result.name}, ${result.country}</option>`
            });

            if(searchResults.length > 0){
                API.fetchFor([
                    searchResults[0].latitude, 
                    searchResults[0].longitude
                ]).then(forecast => {

                    WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);
        
                    WeatherApp.UI.update({
                        city: forecast.city,
                        description: forecast.description,
                        temp: forecast.temperature
                    });
        
                    console.log(forecast);
                })
            }
        });

        WeatherApp.UI.searchbox.select.addEventListener('change', function(event){
            let selectedCity = this.value.split(',');
            console.log(selectedCity);

            WeatherApp.UI.searchbox.input.value = '';

            API.fetchFor(selectedCity).then(forecast => {
                WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);
    
                WeatherApp.UI.update({
                    city: forecast.city,
                    description: forecast.description,
                    temp: forecast.temperature
                });
    
                console.log(forecast);
            })
        });

        API.fetchFor(defaultCity).then(forecast => {
            WeatherApp.changeTabName(forecast.city + ', ' + forecast.country);

            WeatherApp.UI.update({
                city: forecast.city,
                description: forecast.description,
                temp: forecast.temperature
            });

            console.log(forecast);
        })
    },
};

document.addEventListener("DOMContentLoaded", function(){
    WeatherApp.init();
});