import { getPostDetails } from "../../utils/shared.js";
import { calcuteRelativeTimeDifference } from "../../utils/utils.js";

window.addEventListener("load", () => {
  const loadingContainer = document.querySelector("#loading-container");
  getPostDetails().then((post) => {
    console.log(post);
    loadingContainer.style.display = "none";
    const postTitle = document.querySelector("#post-title");
    const postDescription = document.querySelector("#post-description");
    const postLocation = document.querySelector("#post-location");
    const postBreadcrumb = document.querySelector("#breadcrumb");
    const shareIcon = document.querySelector("#share-icon");

    postTitle.textContent = post.title;
    postDescription.textContent = post.description;

    const date = calcuteRelativeTimeDifference(post.createdAt);
    postLocation.textContent = `${date} در ${post.city.name}، ${post.neighborhood ? post?.neighborhood?.name : ""}`;

    postBreadcrumb.insertAdjacentHTML(
      "beforeend",
      `
       <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">
          <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
          <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
        </li>
        <li class="main__breadcrumb-item">${post.title}</li>
      `,
    );

    shareIcon.addEventListener("click", async () => {
      await navigator.share(location.href);
    });
  });
});
