import { baseUrl, getAllLocations } from "../../../utils/shared.js";
import { getToken, getUrlParam, showSwal } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const subCategoryID = getUrlParam("subCategoryID");

  const categoryTitle = document.querySelector("#subCategory-title");
  const loading = document.querySelector("#loading-container");
  const dynamicFields = document.querySelector("#dynamic-fields");
  const uploader = document.querySelector("#uploader");
  const imagesContainer = document.querySelector("#images-container");
  const registerBtn = document.querySelector("#register-btn");
  const citySelectBox = document.querySelector("#city-select");
  const neighborhoodSelectBox = document.querySelector("#neighborhood-select");

  const res = await fetch(`${baseUrl}/v1/category/sub`);
  const response = await res.json();
  const categories = response.data.categories;

  loading.style.display = "none";

  let pics = [];
  const categoryFields = {};
  const token = getToken();

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

  uploader.addEventListener("change", (event) => {
    if (event.target.files.length) {
      let file = event.target.files[0];
      console.log(file);

      if (
        file.type === "image/webp" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      ) {
        pics.push(file);
        generateImage(pics);
        console.log(pics);
      } else {
        showSwal(
          "فرمت فایل آپلود شده مجاز نیست",
          "error",
          "تلاش مجدد",
          () => null,
        );
      }
    }
  });

  const generateImage = async (pics) => {
    imagesContainer.innerHTML = "";
    pics.map((pic) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        let src = reader.result;
        imagesContainer.insertAdjacentHTML(
          "beforeend",
          `
            <div class="image-box">
              <div onclick="deleteImage('${pic.name}')">
                <i class="bi bi-trash"></i>
              </div>
                <img src="${src}" alt="post-image" />
            </div>
          `,
        );
      };
      reader.readAsDataURL(pic);
    });
  };

  window.deleteImage = (picName) => {
    pics = pics.filter((pic) => pic.name !== picName);
    generateImage(pics);
  };

  getAllLocations().then((data) => {
    loading.style.display = "none";

    const cityChoices = new Choices(citySelectBox);
    const neighborhoodChoices = new Choices(neighborhoodSelectBox);

    const tehranNeighborhood = data.neighborhoods.filter(
      (neighborhood) => neighborhood.city_id === 301, // 301 is tehran code
    );

    const neighborhoodChoicesConfigs = [
      {
        value: "default",
        label: "انتخاب محله",
        disabled: true,
        selected: true,
      },
      ...tehranNeighborhood.map((neighborhood) => ({
        value: neighborhood.id,
        label: neighborhood.name,
      })),
    ];

    neighborhoodChoices.setChoices(
      neighborhoodChoicesConfigs,
      "value",
      "label",
      false,
    );

    cityChoices.setChoices(
      data.cities.map((city) => {
        return {
          value: city.id,
          label: city.name,
          customProperties: { id: city.id },
          selected: city.name === "تهران" ? true : false,
        };
      }),
      "value",
      "label",
      false,
    );

    citySelectBox.addEventListener("addItem", (event) => {
      neighborhoodChoices.clearStore();
      const neighborhoods = data.neighborhoods.filter(
        (neighborhood) =>
          neighborhood.city_id === event.detail.customProperties.id,
      );

      console.log(neighborhoods);

      if (neighborhoods.length) {
        const neighborhoodChoicesConfigs = [
          {
            value: "default",
            label: "انتخاب محله",
            disabled: true,
            selected: true,
          },
          ...neighborhoods.map((neighborhood) => ({
            value: neighborhood.id,
            label: neighborhood.name,
          })),
        ];

        neighborhoodChoices.setChoices(
          neighborhoodChoicesConfigs,
          "value",
          "label",
          false,
        );
      } else {
        neighborhoodChoices.setChoices(
          [
            {
              value: 0,
              label: "محله‌ای یافت نشد",
              disabled: true,
              selected: true,
            },
          ],
          "value",
          "label",
          false,
        );
      }
    });
  });

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
