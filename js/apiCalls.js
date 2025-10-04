export async function getWeatherData(city) {
  const cityData = await getLocation(city);

  if (!cityData) return null;

  const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,cloud_cover,weather_code&forecast_days=4&ref=freepublicapis.com`;

  const aqiURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=pm10&forecast_days=1&domains=cams_global`;

  try {
    const weatherRes = await fetch(weatherURL);
    const aqiRes = await fetch(aqiURL);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    cityData.temperature = weatherData.current.temperature_2m;
    cityData.maxTemp = weatherData.daily.temperature_2m_max[1];
    cityData.minTemp = weatherData.daily.temperature_2m_min[1];
    cityData.humidity = weatherData.current.relative_humidity_2m;
    cityData.weatherCode = weatherData.current.weather_code;
    cityData.currentAQI = aqiData.current.pm10;
    cityData.time = weatherData.current.time;
    cityData.timezone = weatherData.timezone;

    cityData.forecast = {
      max: weatherData.daily.temperature_2m_max,
      min: weatherData.daily.temperature_2m_min,
    };

    return cityData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getLocation(cityName) {
  const apiURL = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;

  const locationsRes = await fetch(apiURL);
  const resData = await locationsRes.json();

  if (!resData.results) {
    return null;
  }

  const locationData = {
    latitude: resData.results[0].latitude,
    longitude: resData.results[0].longitude,
    city: resData.results[0].name,
    state: resData.results[0].admin1,
    country: resData.results[0].country,
  };

  return locationData;
}
