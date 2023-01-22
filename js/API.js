const API = {
    key: "a57b2e5cfe5767864699190eee387eb7",

    sanitizeInput: function(rawInput){
        return rawInput.toLowerCase();
    },

    geo: {
        url: 'http://api.openweathermap.org/geo/1.0/direct',
        locate: function(cityName, filterByLang = true){
            cityName = API.sanitizeInput(cityName);
            
            return new Promise(resolve => {
                fetch(`${this.url}?q=${cityName}&limit=5&appid=${API.key}`)
                     .then(response => response.json())
                     .then(response => {
                        if(filterByLang) {
                            response = response.filter(location => {
                                if(location.local_names){
                                    let rawValues = Object.values(location.local_names);
                                    let unifiedValues = rawValues.map(rawValue => {
                                        return rawValue.toLowerCase()
                                    });

                                    return unifiedValues.indexOf(cityName) > -1;
                                }
                            });
                        }

                        resolve(response);
                     });
            });
        },
    },

    weather: {
        url: 'https://api.openweathermap.org/data/2.5/weather',
        units: 'metric',
        now: function(ciyLat, cityLon){
            return new Promise(resolve => {
                fetch(`${this.url}?lat=${ciyLat}&lon=${cityLon}&limit=5&appid=${API.key}&units=${this.units}`)
                     .then(response => response.json())
                     .then(response => {
                        resolve({
                            country: response.sys.country,
                            state: response.state,
                            city: response.name,
                            coordinates: response.coord,
                            temp: response.main.temp,
                            temp_feels_like: response.main.feels_like,
                            description: response.weather[0].description,
                        });
                     });
            });
        }
    }
};
