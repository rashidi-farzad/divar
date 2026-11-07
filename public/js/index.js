import { getAllCities } from "../../utils/shared.js";

window.addEventListener("load", () => {
  const loadingContainer = document.querySelector("#loading-container");
  getAllCities().then((response) => {
    loadingContainer.style.display = "none";
    const popularCitiesContainer = document.querySelector("#popular-cities");
    console.log(response.data.cities);
    const popularCities = response.data.cities.filter((city) => city.popular);
    console.log(popularCities);
    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML(
        "beforeend",
        `
            <li class="main__cities-item">
                <p class="main__cities-link">${city.name}</p>
            </li>
            `,
      );
    });
  });
});
