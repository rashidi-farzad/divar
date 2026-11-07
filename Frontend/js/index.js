import { fetchPopularCities } from "./utils/cities.js";

const $ = document;
const popularCitiesParent = $.querySelector(".main__cities-list .row");

const showPopularCities = (cities) => {
  cities.forEach((city) => {
    popularCitiesParent.insertAdjacentHTML(
      "beforeend",
      `
        <div class="col-2 d-flex justify-content-center">
            <li class="main__cities-item">
                <a class="main__cities-link" href="main.html?city=${city.href}">${city.name}</a>
            </li>
        </div>
      `,
    );
  });
};

window.addEventListener("load", async () => {
  const popularCities = await fetchPopularCities();
  showPopularCities(popularCities);
});
