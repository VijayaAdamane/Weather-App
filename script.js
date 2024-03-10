const userTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInput = document.querySelector("[data-searchCity]");
const errorPage = document.querySelector(".city-not-found")

let currentTab = userTab;
const API_KEY = "2cea7e7015e4e37894d43d32986eab5b";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchedTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAcessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => switchedTab(userTab));

searchTab.addEventListener("click", () => switchedTab(searchTab));

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAcessContainer.classList.add("active");
  } else {
    grantAcessContainer.classList.remove("active");
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAcessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  //   API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();
    errorPage.classList.remove("active");
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName");
  const countryIcon = document.querySelector("[data-countryIcon");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;

  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  const tempInCelc = weatherInfo?.main?.temp - 273.15
  temp.innerText = `${tempInCelc.toFixed(2)} °C`;

  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("NO geolocation support available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

grantAccessBtn.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(cityName) {
  errorPage.classList.remove("active");
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAcessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    );
    const data = await response.json();

    if(response.ok){
      loadingScreen.classList.remove("active");
      errorPage.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    else{
      loadingScreen.classList.remove("active")
      errorPage.classList.add("active");
    }
    
  } catch (err) {
    console.log("Error found");
  }
}
