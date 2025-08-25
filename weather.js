const apiKey = "8e72bf8cd4943a3118974ff9817bf124"; 
const weatherDiv = document.getElementById("weather");
const todayDiv = document.getElementById("today");
const searchBox = document.getElementById("searchBox");

// Search button click
function searchCity() {
  const city = searchBox.value.trim();
  if (city) {
    getWeather(city + ",pk");
  }
}

// Main function
async function getWeather(city) {
  weatherDiv.innerHTML = "Loading...";
  todayDiv.innerHTML = "";

  // Current weather API
  const todayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // 5-day forecast API
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Fetch both together
    const [todayRes, forecastRes] = await Promise.all([
      fetch(todayUrl),
      fetch(forecastUrl)
    ]);

    const todayData = await todayRes.json();
    const forecastData = await forecastRes.json();

    // Show today's weather
    todayDiv.innerHTML = `
      <h2>${todayData.name} - Today</h2>
      <img src="https://openweathermap.org/img/wn/${todayData.weather[0].icon}@2x.png">
      <p><b>${todayData.weather[0].description}</b></p>
      <p>🌡 Temp: ${todayData.main.temp}°C</p>
      <p>💧 Humidity: ${todayData.main.humidity}%</p>
      <p>🌬 Wind: ${todayData.wind.speed} m/s</p>
    `;

    // Show 5-day forecast
    weatherDiv.innerHTML = "";
    for (let i = 0; i < forecastData.list.length; i += 8) {
      const item = forecastData.list[i];
      const date = new Date(item.dt_txt).toDateString();

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
        <p>${item.weather[0].description}</p>
        <p>${item.main.temp_min}°C / ${item.main.temp_max}°C</p>
      `;
      weatherDiv.appendChild(card);
    }
  } catch (err) {
    weatherDiv.innerHTML = "❌ Error fetching data";
  }
}


// Auto-detect user location weather
function getUserLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        // Show weather for detected location
        todayDiv.innerHTML = `
          <h2>${data.name} - Today</h2>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
          <p><b>${data.weather[0].description}</b></p>
          <p>🌡 Temp: ${data.main.temp}°C</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>🌬 Wind: ${data.wind.speed} m/s</p>
        `;

        // Also fetch 5-day forecast
        getWeather(data.name + ",pk");

      } catch (err) {
        todayDiv.innerHTML = "❌ Unable to fetch your location weather";
      }
    }, (error) => {
      todayDiv.innerHTML = "⚠️ Location access denied. Please search manually.";
    });
  } else {
    todayDiv.innerHTML = "⚠️ Geolocation not supported by your browser.";
  }
}

// Run automatically on page load
window.onload = () => {
  getUserLocationWeather();
};





