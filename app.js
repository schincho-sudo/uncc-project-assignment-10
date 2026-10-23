// Simple variables for this front-end prototype.
let cartCount = Number(sessionStorage.getItem("cartCount")) || 0;
let darkMode = localStorage.getItem("theme") === "dark";
let selectedProducts = 0;

const body = document.body;
const menu = document.querySelector(".mobile-menu");
const menuButton = document.querySelector("[data-menu-toggle]");
const toast = document.querySelector(".toast");

// Set up the saved theme when the page opens.
if (darkMode) {
  body.classList.add("dark-mode");
}

updateCartCount();
updateThemeButtons();

// Show a small message at the bottom of the screen.
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;

  setTimeout(function () {
    toast.hidden = true;
  }, 2800);
}
