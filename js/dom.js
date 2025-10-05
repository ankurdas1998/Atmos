import { searchLocations, getWeatherData } from "./apiCalls.js";

const cityInput = document.getElementById("city");
const suggestionsBox = document.querySelector("#suggestions");

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

async function handleInput(e) {
  const query = e.target.value.trim();
  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  const results = await searchLocations(query);
  suggestionsBox.innerHTML = results
    .map(
      (loc) =>
        `<p class="suggestion-item" data-city="${loc.name}">${loc.name}&comma;&nbsp;${loc.country}</p>`
    )
    .join("");
}

cityInput.addEventListener("input", debounce(handleInput, 300));

suggestionsBox.addEventListener("click", async (e) => {
  const item = e.target.closest(".suggestion-item");

  if (!item) return;

  cityInput.value = item.dataset.city;
  suggestionsBox.innerHTML = "";
  const data = await getWeatherData(item.dataset.city);

  renderData(data);
});

async function renderData(data) {
  const parts = [data.city, data.state, data.country].filter(Boolean);
  const locationStr = parts.join(", ");

  document.getElementById("locationDetail").textContent = locationStr;

  //Clock
  const timeData = getTimeData(data.time, data.timezone);

  document.getElementById("hour").textContent = timeData.time.slice(0, 2);
  document.getElementById("minute").textContent = timeData.time.slice(3, 5);
  document.getElementById("meridiem").textContent = timeData.time.slice(6);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  document.getElementById("date").textContent = timeData.date;
  document.getElementById("day").textContent = dayNames[timeData.day];

  //===================

  document.getElementById(
    "currTemp"
  ).innerHTML = `${data.temperature}&deg;&nbsp;C`;
  document.getElementById("low").innerHTML = `${data.minTemp}&deg;`;
  document.getElementById("high").innerHTML = `${data.maxTemp}&deg;`;

  const aqiData = {
    category: getAQICategory(data.currentAQI),
    color: getAQIColor(getAQICategory(data.currentAQI)),
  };

  document.querySelector(
    "#details > p:nth-of-type(1) > span"
  ).innerHTML = `${aqiData.category}`;
  document.querySelector("#details > p:nth-of-type(1) > i").style.color =
    aqiData.color;

  document.querySelector(
    "#details > p:nth-of-type(2) > span"
  ).innerHTML = `${data.humidity}&percnt;`;

  // Forecast Day names
  document.querySelector("#day1>.day").textContent =
    dayNames[(timeData.day + 1) % 7];
  document.querySelector("#day2>.day").textContent =
    dayNames[(timeData.day + 2) % 7];
  document.querySelector("#day3>.day").textContent =
    dayNames[(timeData.day + 3) % 7];

  // Forecast Max Temp
  document.querySelector(
    "#day0 > p > .high"
  ).innerHTML = `${data.forecast.max[0].toFixed(1)}&deg;`;
  document.querySelector(
    "#day1 > p > .high"
  ).innerHTML = `${data.forecast.max[1].toFixed(1)}&deg;`;
  document.querySelector(
    "#day2 > p > .high"
  ).innerHTML = `${data.forecast.max[2].toFixed(1)}&deg;`;
  document.querySelector(
    "#day3 > p > .high"
  ).innerHTML = `${data.forecast.max[3].toFixed(1)}&deg;`;

  // Forecast Min Temp
  document.querySelector(
    "#day0 > p > .low"
  ).innerHTML = `${data.forecast.min[0].toFixed(1)}&deg;`;
  document.querySelector(
    "#day1 > p > .low"
  ).innerHTML = `${data.forecast.min[1].toFixed(1)}&deg;`;
  document.querySelector(
    "#day2 > p > .low"
  ).innerHTML = `${data.forecast.min[2].toFixed(1)}&deg;`;
  document.querySelector(
    "#day3 > p > .low"
  ).innerHTML = `${data.forecast.min[3].toFixed(1)}&deg;`;
}

function getAQICategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 250) return "Moderate";
  if (aqi <= 350) return "Poor";
  if (aqi <= 430) return "Very Poor";
  return "Severe";
}

function getAQIColor(category) {
  switch (category) {
    case "Good":
      return "lightgreen";
    case "Satisfactory":
      return "yellow";
    case "Moderate":
      return "orange";
    case "Poor":
      return "red";
    case "Very Poor":
      return "purple";
    case "Severe":
      return "maroon";
    default:
      return "gray";
  }
}

function getTimeData(time, timezone) {
  const dateStr = `${time}${timezone === "GMT" ? "Z" : ""}`;
  const dateObj = new Date(dateStr);

  const shortDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const shortTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    time: shortTime,
    date: shortDate,
    day: dateObj.getDay(),
  };
}

// Run on page load
window.addEventListener("load", async () => {
  const defaultCity = cityInput.value.trim() || "Mumbai";
  const data = await getWeatherData(defaultCity);
  renderData(data);
});

// Run on button click
document.getElementById("fetchBtn").addEventListener("click", renderData);

// Run when Enter is pressed in the input
cityInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    suggestionsBox.innerHTML = "";

    const city = e.target.value.trim();
    const data = await getWeatherData(city);

    if (!city || !data) {
      showPopup();
      return;
    }

    renderData(data);
  }
});

cityInput.addEventListener("focus", (e) => {
  e.target.select();
});

function showPopup() {
  const popup = document.querySelector(".pop-up");

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}
