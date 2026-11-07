import {
  fetchPopularCities,
  getCityCookie,
  setCityCookie,
  fetchCities,
} from "./utils/cities.js";

const $ = document;
const popularCitiesParent = $.querySelector(".main__cities-list .row");
const citySearchInput = $.querySelector(".main__input");
const citiesSearchResult = document.querySelector(".search-result-cities");
let cities = null;

const cityClickHandler = (event, city) => {
  event.preventDefault();
  setCityCookie(city);
  window.location.href = `http://127.0.0.1:5500/Frontend/pages/main.html?city=${city}`;
};

const showPopularCities = (cities) => {
  cities.forEach((city) => {
    popularCitiesParent.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col-2 d-flex justify-content-center">
            <li class="main__cities-item">
                <a class="main__cities-link" href="#" onclick="cityClickHandler(event, '${city.href}')">${city.name}</a>
            </li>
        </div>
      `,
    );
  });
};

const loadCityPosts = (cityCookie) => {
  if (cityCookie) {
    window.location.href = `http://127.0.0.1:5500/Frontend/pages/main.html?city=${cityCookie}`;
  } else {
    // Codes
  }
};

window.cityClickHandler = cityClickHandler;

const citySearchHandler = (event) => {
  const citySearchTitle = event.target.value;
  if (citySearchTitle.trim()) {
    const citiesResult = cities.filter((city) =>
      city.name.startsWith(citySearchTitle),
    );
    citiesSearchResult.classList.add("active");
    citiesSearchResult.innerHTML = "";
    citiesResult.forEach((city) => {
      citiesSearchResult.insertAdjacentHTML(
        "beforeend",
        `
        <li>${city.name}</li>
      `,
      );
    });
    return true;
  }
  citiesSearchResult.classList.remove("active");
};

citySearchInput.addEventListener("keyup", (event) => citySearchHandler(event));

window.addEventListener("load", async () => {
  const popularCities = await fetchPopularCities();
  showPopularCities(popularCities);

  const cityCookie = getCityCookie();
  loadCityPosts(cityCookie);
  cities = await fetchCities();
});
