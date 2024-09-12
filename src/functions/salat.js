const { default: axios } = require("axios");

module.exports = async function salat(message, client) {

    let city = message.body.slice(7);
    let date = new Date()
    let currentYear = date.getFullYear()
    let currentMonth = date.getMonth() + 1
    let currentDay = date.getDate() - 1
    console.log(city);

    let apiKey = process.env.WEATHER_API;
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    let coord = response.data.coord

    let salahResponse = await axios.get(`http://api.aladhan.com/v1/calendar/${currentYear}/${currentMonth}?latitude=${coord.lat}&longitude=${coord.lon}`)

    let salahData = salahResponse.data
    let todayData = salahData.data

    let salatTime = {
        timings: {
            Fajr: todayData[currentDay].timings.Fajr,
            Dhuhr: todayData[currentDay].timings.Dhuhr,
            Asr: todayData[currentDay].timings.Asr,
            Maghrib: todayData[currentDay].timings.Maghrib,
            Isha: todayData[currentDay].timings.Isha,
        },
        date: {
            readable: todayData[currentDay].date.readable,
            hijri: {
                date: todayData[currentDay].date.hijri.date,
            }
        }
    };

    const responseMessage = `

📅 *Date* : ${salatTime.date.readable}
🕌 *Hijri Date* : ${salatTime.date.hijri.date}


🕰️ Prayer Times In ${city}:

- *Fajr* : ${salatTime.timings.Fajr}

- *Dhuhr* : ${salatTime.timings.Dhuhr}

- *Asr* : ${salatTime.timings.Asr}

- *Maghrib* : ${salatTime.timings.Maghrib}

- *Isha* : ${salatTime.timings.Isha}
    `;

    await client.sendMessage(message.from, responseMessage.trim());





}