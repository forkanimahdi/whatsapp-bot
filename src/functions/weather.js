const { default: axios } = require("axios");

module.exports = async function weather(message, client) {

    let city = message.body.slice(9);
    console.log(city);

    let apiKey = process.env.WEATHER_API;
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    let weatherData = response.data


    // Extracted variables
    const location = `${weatherData.name}, ${weatherData.sys.country}`;
    const temperature = `${weatherData.main.temp}°C`;
    const feelsLike = `${weatherData.main.feels_like}°C`;
    const humidity = `${weatherData.main.humidity}%`;
    const windSpeed = `${weatherData.wind.speed} m/s`;
    const windDirection = `${weatherData.wind.deg}°`;
    const pressure = `${weatherData.main.pressure} hPa`;
    const visibility = `${weatherData.visibility / 1000} km`;
    const cloudCoverage = `${weatherData.clouds.all}%`;

    // Convert Unix timestamps to human-readable time
    const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US');
    const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US');

    // Determine appropriate weather emoji based on condition
    let weatherEmoji = '';
    let weatherSummary = '';

    const mainWeather = weatherData.weather[0].main.toLowerCase();
    const description = weatherData.weather[0].description;

    const weatherConditions = [
        { condition: "clear", emoji: "☀️", summary: `It's a sunny day in ${location}. Perfect for outdoor activities!` },
        { condition: "clouds", emoji: weatherData.clouds.all > 50 ? "☁️" : "🌤️", summary: weatherData.clouds.all > 50 ? `It's quite cloudy in ${location}. You might not see much of the sun today.` : `There are a few clouds in the sky, but the sun is still shining in ${location}.` },
        { condition: "rain", emoji: "🌧️", summary: `It's raining in ${location}. Don't forget your umbrella if you're heading out!` },
        { condition: "thunderstorm", emoji: "⛈️", summary: `There's a thunderstorm in ${location}. Stay safe and consider staying indoors.` },
        { condition: "snow", emoji: "❄️", summary: `It's snowing in ${location}. Enjoy the winter wonderland!` },
        { condition: "fog", emoji: "🌫️", summary: `Visibility is low due to fog/mist in ${location}. Drive carefully.` },
        { condition: "mist", emoji: "🌫️", summary: `Visibility is low due to fog/mist in ${location}. Drive carefully.` },
        { condition: "default", emoji: "🌡️", summary: `Current weather in ${location} is ${description}. Stay prepared!` }
    ];


    for (let i = 0; i < weatherConditions.length; i++) {
        if (weatherData.weather[0].main.toLowerCase().includes(weatherConditions[i].condition)) {
            weatherEmoji = weatherConditions[i].emoji;
            weatherSummary = weatherConditions[i].summary;
            break;
        }
    }


    // Construct the message
    const weatherMessage = `
**${weatherEmoji} Weather Update for ${location}:**

**Temperature:** ${temperature} (Feels like: ${feelsLike})  
**Condition:** ${description.charAt(0).toUpperCase() + description.slice(1)}  
**Humidity:** ${humidity}  
**Wind:** ${windSpeed} from the North-East  
**Pressure:** ${pressure}  
**Visibility:** ${visibility}  
**Cloud Coverage:** ${cloudCoverage}

**🌅 Sunrise:** ${sunrise}  
**🌇 Sunset:** ${sunset}

**Summary:**  
${weatherSummary}

**Pro Tips:**  
- **Going Out?** ${weatherSummary.includes('rain') ? "Take an umbrella with you." : "The weather is great for a stroll outside."}
- **Hydration Alert:** With ${humidity} humidity, it's important to stay hydrated.
`;


    client.sendMessage(message.from, weatherMessage)



}