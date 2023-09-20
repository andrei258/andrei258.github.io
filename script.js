const cities = window.cities;
const WMOcodes = window.WMOcodes;
const apiUrl = "https://api.open-meteo.com/v1/forecast?";

document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("container");
    var marqueeContainer = document.getElementById("marquee-container");
    var marqueeText = document.getElementById("marquee-text");
    var text = document.getElementById("text");
    var image1 = document.getElementById("image1");
    var image2 = document.getElementById("image2");

    var containerMinWidth = 1500; // also width of images
    var containerMinHeight = 1125; // also height of images
    var h1Top = 110;
    var h1Size = 190;
    var marqueeContainerLeft = 140;
    var marqueeContainerWidth = 1240;
    var marqueeContainerHeight = 800;
    var marqueeTextRight = 1370;


    function getRandomCountryData(data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
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
        // open-meteo doesn't provide minutes so I get them through JS
        const currentMinutes = new Date().getMinutes().toString().padStart(2, "0");
        const formattedDate = `${month}. ${day}, ${year} ${hours}:${currentMinutes}`;

        return formattedDate;
    }

    function updateMarqueePosition(containerWidth, text, fontSize) {
        let constFontSizeMultiplier = fontSize/3.5;
        let marqueeText = document.querySelector(".marquee-text");
        let newEndingPoint = containerWidth + constFontSizeMultiplier * text.length;
        marqueeText.style.setProperty("--endPosition", "-" + newEndingPoint + "px");
    }

    const constWindowWidth = window.innerWidth;
    function applyAnimationText(windowWidth){
        if (windowWidth > 1920)
            text.style.animationName = "colorChange1";
        if (windowWidth <= 1920 && constWindowWidth >= 1400)
            text.style.animationName = "colorChange2";
        if (windowWidth < 1400 && constWindowWidth >= 1000)
            text.style.animationName = "colorChange3";
        if (windowWidth < 1000 && constWindowWidth >= 600)
            text.style.animationName = "colorChange4";
        if (windowWidth < 600)
            text.style.animationName = "colorChange5";
    }

    function adjustMarqueeContainer(windowWidth){
        if (windowWidth >= 1800) {
            return 140; // default value
        }
        else if (windowWidth < 1800 && windowWidth >= 1500) {
            return 146;
        }
        else if (windowWidth < 1500 && windowWidth >= 1200) {
            return 148;
        }
        else if (windowWidth < 1200 && windowWidth >= 900) {
            return 152;
        }
        else if (windowWidth < 900 && windowWidth >= 600) {
            return 158;
        }
        else {
            return 172;
        }
    }

    function applyUpdatedSize(ratio, windowWidth){
        if (windowWidth >= 2560) // max width
            ratio = 1;
        image1.style.maxWidth = (containerMinWidth*ratio) + 'px';
        image1.style.maxHeight = (containerMinHeight*ratio) + 'px';
        image2.style.maxWidth = (containerMinWidth*ratio) + 'px';
        image2.style.maxHeight = (containerMinHeight*ratio) + 'px';

        container.style.minWidth = (containerMinWidth*ratio) + 'px';
        container.style.minHeight = (containerMinHeight*ratio) + 'px';

        text.style.top = (h1Top*ratio) + "px";
        text.style.fontSize = (h1Size*ratio) + "px";

        marqueeContainerLeft = adjustMarqueeContainer(windowWidth); // change size based on resolution
        marqueeContainer.style.left = (marqueeContainerLeft*ratio) + "px";
        marqueeContainer.style.width = (marqueeContainerWidth*ratio) + "px";
        marqueeContainer.style.height = (marqueeContainerHeight*ratio) + "px";
        marqueeText.style.right = (marqueeTextRight*ratio) + "px";
    }

    function updateSize() {
        let windowWidth = window.innerWidth;
        // let windowHeight = window.innerHeight;
        let ratio = (windowWidth/2560).toFixed(2);
        let finalRatioWidth = marqueeContainerWidth*ratio;
        let finalH1Size = h1Size*ratio;

        // min width
        if (windowWidth < 440){
            return;
        }
        // max width
        if (windowWidth > 2560){
            applyUpdatedSize(ratio, windowWidth);
            applyAnimationText(windowWidth)
            updateMarqueePosition(finalRatioWidth, text.textContent, finalH1Size);
            return;
        }
        
        applyUpdatedSize(ratio, windowWidth);
        applyAnimationText(windowWidth)
        updateMarqueePosition(finalRatioWidth, text.textContent, finalH1Size);
    }

    const randomCountryData = getRandomCountryData(cities);

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
        return response.json();
    })
    .then((data) => {
        // console.log(data);
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
            " - Temperature: " +
            data.current_weather.temperature +
            "c - " +
            " Wind: " +
            data.current_weather.windspeed +
            "kmh";
        // update marquee ending position based on how long the string is
        updateSize();
    })
    .catch((error) => {
        console.error("Fetch error:", error);
    });

    window.addEventListener("resize", updateSize);
    window.addEventListener("load", updateSize);
    applyAnimationText(constWindowWidth)
});

