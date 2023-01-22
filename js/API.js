const API = {
    key: "a57b2e5cfe5767864699190eee387eb7",
    tempkey: "51e7ad19ab5051dcc6db1bd66a5c3da9",

    sanitizeInput: function(rawInput){
        return rawInput.toLowerCase();
    },

    geo: {
        url: 'http://api.openweathermap.org/geo/1.0/direct',
        locate: function(cityName, filterByLang = true){
            cityName = API.sanitizeInput(cityName);
            
            return new Promise(resolve => {
                fetch(`${this.url}?q=${cityName}&limit=5&appid=${API.tempkey}`)
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
        now: function(cityName){
            cityName = API.sanitizeInput(cityName);

            return new Promise(resolve => {
                fetch(`${this.url}?q=${cityName}&limit=5&appid=${API.tempkey}`)
                     .then(response => response.json())
                     .then(response => {
                        resolve(response);
                     });
            });
        }
    },

    fetchFor: function(cityName){

        if(cityName && typeof cityName === 'string'){
            return fetch(API.url + `?q=${cityName}&units=metric&appid=${API.tempkey}`)
                    .then(response => response.json());
        } else {
            throw new Error('API.fetchFor: incorrect cityName argument!');
        }
    },
};
