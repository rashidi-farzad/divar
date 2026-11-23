import { baseUrl } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const subCategoryID = getUrlParam("subCategoryID");

  const categoryTitle = document.querySelector(".category_details p");
  const loading = document.querySelector("#loading-container");
  const dynamicFields = document.querySelector("#dynamic-fields");
  const registerBtn = document.querySelector("#register-btn");
  const citySelect = document.querySelector("#city-select");
  const neighborhoodSelect = document.querySelector("#neighborhood-select");

  const res = await fetch(`${baseUrl}/v1/category/sub`);
  const response = await res.json();
  const categories = response.data.categories;

  loading.style.display = "none";

  const categoryFields = {};

  const subCategory = categories.find(
    (category) => category._id === subCategoryID,
  );

  categoryTitle.textContent = subCategory.title;

  subCategory.productFields.map((field) => {
    dynamicFields.insertAdjacentHTML(
      "beforeend",
      `
        ${
          field.type === "selectbox"
            ? `
                <div class="group">
                  <p class="field-title">${field.name}</p>
                  <div class="field-box">
                    <select required="required" onchange="fieldChangeHandler('${
                      field.slug
                    }', event.target.value)">
                      <option value="default">انتخاب</option>
                      ${field.options.map(
                        (option) =>
                          `<option value="${option}">${option}</option>`,
                      )}
                    </select>
                    <svg>
                      <use xlink:href="#select-arrow-down"></use>
                    </svg>
                  </div>
                  <svg class="sprites">
                    <symbol id="select-arrow-down" viewbox="0 0 10 6">
                      <polyline points="1 1 5 5 9 1"></polyline>
                    </symbol>
                  </svg>
                </div>
              `
            : `
                <div class="group checkbox-group">
                  <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" />
                  <p>${field.name}</p>
                </div>          
              `
        }
      `,
    );
  });

  window.fieldChangeHandler = (slug, data) => {
    console.log({ slug, data });
    categoryFields[slug] = data;

    console.log("categoryFields ->", categoryFields);
  };

  subCategory.productFields.forEach((field) => {
    if (field.type === "checkbox") {
      categoryFields[field.slug] = false;
    } else {
      categoryFields[field.slug] = null;
    }
  });

  console.log("Default categoryFields ->", categoryFields);

  registerBtn.addEventListener("click", async () => {
    // 2 Validation (Dynamic - Static)

    const formData = new FormData();
    // formData.append()
    // pics array

    const res = await fetch(`${baseUrl}/v1/post/${subCategoryID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 200) {
      // Codes
    }
  });
});
