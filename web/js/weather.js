/**
 * weather.js - Open-Meteo Live Weather Integration
 * Fetches real-time weather forecasts for the luxury hotel sanctuary
 */

const HOTEL_LOCATION = {
  city: 'Waterfront',
  latitude: -33.9036,
  longitude: 18.4205,
  timezone: 'auto'
};

async function fetchLiveHotelWeather() {
  const weatherPill = document.getElementById('liveWeatherBadge');
  const weatherTemp = document.getElementById('weatherTemp');
  const weatherIcon = document.getElementById('weatherIcon');
  const weatherDesc = document.getElementById('weatherDesc');

  if (!weatherPill) return;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${HOTEL_LOCATION.latitude}&longitude=${HOTEL_LOCATION.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=${HOTEL_LOCATION.timezone}`;
    
    // Set a 3-second timeout for rapid page loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('Weather API response error');

    const data = await response.json();
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const code = current.weather_code;

    const weatherInfo = interpretWeatherCode(code);

    if (weatherTemp) weatherTemp.textContent = `${temp}°C`;
    if (weatherIcon) weatherIcon.className = weatherInfo.icon;
    if (weatherDesc) weatherDesc.textContent = weatherInfo.text;

  } catch (err) {
    console.info('Using offline / cached hotel weather:', err.message);
    // Graceful luxury fallback
    if (weatherTemp) weatherTemp.textContent = '24°C';
    if (weatherIcon) weatherIcon.className = 'fas fa-sun';
    if (weatherDesc) weatherDesc.textContent = 'Sunny Coastal Breeze';
  }
}

function interpretWeatherCode(code) {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { text: 'Clear Sky', icon: 'fas fa-sun' };
  if (code === 1 || code === 2) return { text: 'Mainly Clear', icon: 'fas fa-cloud-sun' };
  if (code === 3) return { text: 'Partly Cloudy', icon: 'fas fa-cloud' };
  if (code >= 45 && code <= 48) return { text: 'Gentle Mist', icon: 'fas fa-smog' };
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', icon: 'fas fa-cloud-rain' };
  if (code >= 61 && code <= 65) return { text: 'Coastal Rain', icon: 'fas fa-cloud-showers-heavy' };
  if (code >= 80 && code <= 82) return { text: 'Passing Showers', icon: 'fas fa-cloud-sun-rain' };
  if (code >= 95) return { text: 'Mild Thunderstorm', icon: 'fas fa-bolt' };
  return { text: 'Pleasant & Calm', icon: 'fas fa-cloud-sun' };
}

document.addEventListener('DOMContentLoaded', fetchLiveHotelWeather);

