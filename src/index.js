import "./styles/styles.css";

import clearDay from "./assets/clear-day.svg";
import clearNight from "./assets/clear-night.svg";
import cloudy from "./assets/cloudy.svg";
import fog from "./assets/fog.svg";
import hail from "./assets/hail.svg";
import partlyCloudyDay from "./assets/partly-cloudy-day.svg";
import partlyCloudyNight from "./assets/partly-cloudy-night.svg";
import rainSnowShowersDay from "./assets/rain-snow-showers-day.svg";
import rainSnowShowersNight from "./assets/rain-snow-showers-night.svg";
import rainSnow from "./assets/rain-snow.svg";
import rain from "./assets/rain.svg";
import showersDay from "./assets/showers-day.svg";
import showersNight from "./assets/showers-night.svg";
import sleet from "./assets/sleet.svg";
import snowShowersDay from "./assets/snow-showers-day.svg";
import snowShowersNight from "./assets/snow-showers-night.svg";
import snow from "./assets/snow.svg";
import thunderRain from "./assets/thunder-rain.svg";
import thunderShowersDay from "./assets/thunder-showers-day.svg";
import thunderShowersNight from "./assets/thunder-showers-night.svg";
import thunder from "./assets/thunder.svg";
import wind from "./assets/wind.svg";

const imageIcons = {
  cloudy: cloudy,
  fog: fog,
  hail: hail,
  rain: rain,
  sleet: sleet,
  snow: snow,
  thunder: thunder,
  wind: wind,
  "clear-day": clearDay,
  "clear-night": clearNight,
  "partly-cloudy-day": partlyCloudyDay,
  "partly-cloudy-night": partlyCloudyNight,
  "rain-snow-showers-day": rainSnowShowersDay,
  "rain-snow-showers-night": rainSnowShowersNight,
  "rain-snow": rainSnow,
  "showers-day": showersDay,
  "showers-night": showersNight,
  "snow-showers-day": snowShowersDay,
  "snow-showers-night": snowShowersNight,
  "thunder-rain": thunderRain,
  "thunder-showers-day": thunderShowersDay,
  "thunder-showers-night": thunderShowersNight,
};

const API_KEY = "N252VEE3PNULMBJ4QWGZQEJ9D";
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

let useMetric = false; // Show Fahrenheit as default

const celsiusButton = document.querySelector(".celsius");
const fahrenheitButton = document.querySelector(".fahrenheit");

celsiusButton.addEventListener("click", () => {
  celsiusButton.classList.add("selected");
  fahrenheitButton.classList.remove("selected");
  useMetric = true;
  updateTempsDisplay(currentWeather);
});

fahrenheitButton.addEventListener("click", () => {
  celsiusButton.classList.remove("selected");
  fahrenheitButton.classList.add("selected");
  useMetric = false;
  updateTempsDisplay(currentWeather);
});

function fahrenheitToCelsius(fahrenheit) {
  return (((fahrenheit - 32) * 5) / 9).toFixed(1);
}

async function getCurrentWeather(city) {
  const url = BASE_URL + `${city}&?unitGroup=us&key=${API_KEY}`;

  const response = await fetch(url);
  const weatherData = await response.json();
  const currentWeather = {
    address: weatherData.resolvedAddress,
    temp: weatherData.currentConditions.temp,
    humidity: weatherData.currentConditions.humidity,
    conditions: weatherData.currentConditions.conditions,
    icon: weatherData.currentConditions.icon,
    feelslike: weatherData.currentConditions.feelslike,
    windspeed: weatherData.currentConditions.windspeed,
  };

  return currentWeather;
}
function updateTempsDisplay(currentWeather) {
  const windUnit = useMetric ? "km/h" : "mph";
  const tempUnit = useMetric ? "°C" : "°F";

  const temp = useMetric
    ? fahrenheitToCelsius(currentWeather.temp)
    : currentWeather.temp;
  const feelslike = useMetric
    ? fahrenheitToCelsius(currentWeather.feelslike)
    : currentWeather.feelslike;
  const locationName = document.querySelector(".location-name");
  locationName.textContent = currentWeather.address;

  const tempDiv = document.querySelector(".temp");

  tempDiv.textContent = temp + ` ${tempUnit}`;

  const conditionIcon = document.querySelector(".condition-icon");
  conditionIcon.src = imageIcons[`${currentWeather.icon}`];

  const conditionText = document.querySelector(".condition-text");
  conditionText.textContent = currentWeather.conditions;

  const feelsLikeValueDiv = document.querySelector(".feelslike-value");

  feelsLikeValueDiv.textContent = feelslike + ` ${tempUnit}`;

  const humidityValue = document.querySelector(".humidity-value");
  humidityValue.textContent = currentWeather.humidity + "%";

  const windValue = document.querySelector(".wind-value");
  windValue.textContent = currentWeather.windspeed + ` ${windUnit}`;
}

const locationInput = document.querySelector("#location");
const searchButton = document.querySelector("#search-button");
const errorSpan = document.querySelector("span.error");
searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const location = locationInput.value;
  try {
    const weather = await getCurrentWeather(location);
    updateTempsDisplay(weather);
    currentWeather = weather;
  } catch (error) {
    errorSpan.textContent = "Please Enter a valid city or location.";

    errorSpan.classList.add("visible");
  }
});

locationInput.addEventListener("input", () => {
  errorSpan.classList.remove("visible");
});
let currentWeather = null;
getCurrentWeather("Las Vegas").then((weather) => {
  updateTempsDisplay(weather);
  currentWeather = weather;
});
