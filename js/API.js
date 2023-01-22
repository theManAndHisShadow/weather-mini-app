const API = {
    // key that gives access to API
    key: "a57b2e5cfe5767864699190eee387eb7",



    /**
     * Turn all input data to unified form
     * @param {string} rawInput for example cityName
     * @returns same text with all low case letter
     */
    sanitizeInput: function(rawInput){
        return rawInput.toLowerCase();
    },


    
    // operations with date
    date: {
        /**
         * Returns time in human format
         * @param {number} timestamp 
         * @returns hours:minutes
         */
        getHumanTime: function(timestamp){
            let date = new Date(timestamp * 1000);

            return `${date.getHours()}:${date.getMinutes()}`
        },
    },



    // operations with location
    geo: {
        url: 'https://api.openweathermap.org/geo/1.0/direct',

        /**
         * Request location data using params
         * @param {string} cityName Target city name
         * @param {boolean} filterByLang (optional) Use filtering by input lang
         * @returns .then() with access to 'locations' var.
         */
        locate: function(cityName, filterByLang = false){
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



    // operations with weather
    weather: {
        url: 'https://api.openweathermap.org/data/2.5/weather',

        // which units system must be used in requests
        units: 'metric',

        /**
         * Request current weather data using params
         * @param {string|number} ciyLat target city latitude
         * @param {string|number} cityLon target city longitude
         * @returns .then() with access to 'weather' var.
         */
        now: function(ciyLat, cityLon){
            return new Promise(resolve => {
                fetch(`${this.url}?lat=${ciyLat}&lon=${cityLon}&limit=5&appid=${API.key}&units=${this.units}`)
                     .then(response => response.json())
                     .then(response => {
                        console.log(response);
                        
                        // Transform to own data form 
                        resolve({
                            country: response.sys.country,
                            state: response.state,
                            city: response.name,
                            coordinates: response.coord,
                            temp: Math.round(Number(response.main.temp)),
                            temp_feels_like: Math.round(Number(response.main.feels_like)),
                            description: response.weather[0].description,
                            time: API.date.getHumanTime(response.dt), 
                        });
                     });
            });
        }
    }
};
