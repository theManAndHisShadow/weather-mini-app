const WEATHER_DATA_CODES = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy", 
    "3": "Overcast",
    "45": "Fog",
    "48": "Rime fog",
    "51": "Drizzle: light",
    "53": "Drizzle: moderate,",
    "55": "Drizzle: dense intensity",	
    "56": "Freezing Drizzle: light", 
    "57": "Freezing Drizzle: dense intensity",
    "61": "Rain: slight",
    "63": "Rain: moderate",
    "65": "Rain: heavy intensity",
    "66": "Freezing Rain: light",
    "67": "Freezing Rain: heavy intensity",
    "71": "Snow fall: slight", 
    "73": "Snow fall: moderate", 
    "75": "Snow fall: heavy intensity",
    "77": "Snow grains",
    "80": "Rain showers: slight", 
    "81": "Rain showers: moderate", 
    "82": "Rain showers: violent", 
    "85": "Snow showers slight", 
    "86": "Snow showers heavy", 
    "95": "Thunderstorm: slight or moderate",
    "96": "Thunderstorm with slight hail",
    "99": "Thunderstorm with heavy hail",
};

const API = {
    key: "a57b2e5cfe5767864699190eee387eb7",
    tempkey: "51e7ad19ab5051dcc6db1bd66a5c3da9",
    url: 'https://api.openweathermap.org/data/2.5/weather',

    uniformData: function(cityData, fetchData){
        console.log(fetchData);
        return {
            city: cityData.name,
            country: cityData.country,
            latitude:cityData.latitude,
            longitude: cityData.longitude,
            temperature: fetchData.hourly.temperature_2m[0],
            description: WEATHER_DATA_CODES[fetchData.hourly.weathercode[0]],
        }
    },


    fetchFor: function(coordsArray){
        if(coordsArray && Array.isArray(coordsArray)){
            return new Promise(resolve => {
                let cityData = CITIES_DATA_JSON.find(city => {
                    return city.latitude == coordsArray[0] && city.longitude == coordsArray[1];
                });
        
                fetch(API.url + `?q=${'london'}&units=metric&appid=${API.tempkey}`)
                    .then(response => response.json()).then(response => {
                        resolve(API.uniformData(cityData, response));
                    });
            });
        } else {
            throw new Error('API.fetchFor: incorrect coordsArray argument!');
        }
    },
};
