const API = {
    url: 'https://api.open-meteo.com/v1/forecast',

    uniformData: function(cityData, fetchData){
        return {
            city: cityData.name,
            country: cityData.country,
            longitude: cityData.lng,
            latitude:cityData.lat,
            temperature: fetchData.hourly.temperature_2m[0],
            weathercode: fetchData.hourly.weathercode[0]
        }
    },


    fetchFor: function(cityName){
        if(cityName && typeof cityName === 'string' && /[a-zA-Z]+/gm.test(cityName)){
            return new Promise(resolve => {
                let cityData = CITIES_DATA_JSON.find(city => {
                    return city.name === cityName;
                });
        
                fetch(API.url + `?latitude=${cityData.lat}&longitude=${cityData.lng}&hourly=temperature_2m,weathercode`)
                    .then(response => response.json()).then(response => {
                        resolve(API.uniformData(cityData, response));
                    });
            });
        } else {
            throw new Error('API.fetchFor: incorrect cityName argument!');
        }
    },
};
