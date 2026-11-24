import { getMe, isLogin } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const sidebarPhoneNumber = document.querySelector("#sidebar-phone-number");

  const isUserLogin = await isLogin();
  if (isUserLogin) {
    getMe().then((user) => {
      sidebarPhoneNumber.textContent = `تلفن: ${user.phone}`;
    });
  } else {
    location.href = "/pages/posts.html";
  }
});
