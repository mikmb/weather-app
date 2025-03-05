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

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

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
  conditionIcon.src = `../assets/${currentWeather.icon}.svg`;

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
