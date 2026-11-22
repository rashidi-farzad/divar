import { getArticleByCategory, getArticleByID } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";
window.addEventListener("load", () => {
  const articleID = getUrlParam("id");

  const loading = document.querySelector("#loading-container");
  const breadcrumbSpan = document.querySelector("#breadcumb span");
  const articleTitle = document.querySelector("#article-title");
  const articleBody = document.querySelector("#article-body");
  const sameArticles = document.querySelector("#same-articles");

  getArticleByID(articleID).then((article) => {
    loading.style.display = "none";

    breadcrumbSpan.textContent = article.title;
    articleTitle.textContent = article.title;
    articleBody.textContent = article.body;
    document.title = article.title;

    getArticleByCategory(article.categories[0]).then((articles) => {
      articles.map((article) => {
        sameArticles.insertAdjacentHTML(
          "beforeend",
          `
                <a href="/pages/support/article.html?id=${article._id}">${article.title}</a>
                `,
        );
      });
    });
  });
});
