const cities = window.cities;
const WMOcodes = window.WMOcodes;

function getRandomCountryData(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function updateMarqueePosition(text) {
    let marqueeText = document.querySelector(".marquee-text");
    let newEndingPoint = 1240 + 60 * text.length;
    marqueeText.style.setProperty("--endPosition", "-" + newEndingPoint + "px");
}

function getWMOcode(WMOcode, isDay) {
    if (isDay === 1) {
        return WMOcodes[WMOcode].day.description;
    } else {
        return WMOcodes[WMOcode].night.description;
    }
}

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        date
    );
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    // Get the current time components
    const currentMinutes = new Date().getMinutes().toString().padStart(2, "0");
    // Construct the formatted string
    const formattedDate = `${month}. ${day}, ${year} ${hours}:${currentMinutes}`;

    return formattedDate;
}

const randomCountryData = getRandomCountryData(cities);
const apiUrl = "https://api.open-meteo.com/v1/forecast?";

fetch(
    apiUrl +
        "latitude=" +
        randomCountryData.capitalLatitude.replace(",", ".") +
        "&longitude=" +
        randomCountryData.capitalLongitude.replace(",", ".") +
        "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=auto&forecast_days=1"
)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse the response JSON
        return response.json();
    })
    .then((data) => {
        console.log(data);
        date = formatDate(data.current_weather.time);

        const weatherCode = getWMOcode(
            data.current_weather.weathercode,
            data.current_weather.is_day
        );

        const text = document.getElementById("text");
        text.textContent =
            randomCountryData.capitalName +
            ", " +
            randomCountryData.countryName +
            " - " +
            date +
            " - Currently: " +
            weatherCode +
            " - Temperature " +
            data.current_weather.temperature +
            "c - " +
            " Wind: " +
            data.current_weather.windspeed +
            "kmh";
        // update marquee ending position based on how long the string is
        updateMarqueePosition(text.textContent);
    })
    .catch((error) => {
        // Handle errors here
        console.error("Fetch error:", error);
    });
