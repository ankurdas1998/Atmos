const weatherIcons = {
  0: "clear_sky.png", // Clear
  1: "partly_cloudy.png", // Mainly clear
  2: "partly_cloudy.png", // Partly cloudy
  3: "overcast.png", // Overcast
  45: "fog.png", // Fog
  48: "fog.png", // Fog

  51: "drizzle.png", // All drizzle
  53: "drizzle.png",
  55: "drizzle.png",
  56: "drizzle.png",
  57: "drizzle.png",

  61: "rain.png", // All rain
  63: "rain.png",
  65: "rain.png",
  66: "rain.png",
  67: "rain.png",

  71: "snow.png", // All snow
  73: "snow.png",
  75: "snow.png",
  77: "snow.png",

  80: "rain_showers.png", // Rain showers
  81: "rain_showers.png",
  82: "rain_showers.png",

  85: "snow_showers.png", // Snow showers
  86: "snow_showers.png",

  95: "thunderstorm.png", // Thunderstorm
  96: "thunderstorm_hail.png", // Thunderstorm + hail
  99: "thunderstorm_hail.png",
};

export function getWeatherIcon(code) {
  return weatherIcons[code] || "default.png";
}
