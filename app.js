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

// Update every cart badge in the header.
function updateCartCount() {
  const cartCounts = document.querySelectorAll(".cart-count");

  cartCounts.forEach(function (count) {
    count.textContent = cartCount;
    count.hidden = cartCount === 0;
  });
}

// Turn dark mode on or off.
function updateThemeButtons() {
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");

  themeButtons.forEach(function (button) {
    const label = button.querySelector(".theme-label");
    const icon = button.querySelector(".theme-icon");
    const switchCircle = button.querySelector(".switch");

    if (switchCircle) {
      switchCircle.classList.toggle("is-on", darkMode);
    }

    if (icon) {
      icon.innerHTML = darkMode
        ? '<i class="fa-regular fa-moon"></i>'
        : '<i class="fa-regular fa-sun"></i>';
    }

    if (label) {
      label.textContent = "Dark mode";
    }

    if (!label) {
      button.innerHTML = darkMode
        ? '<i class="fa-regular fa-sun"></i> Switch to light mode'
        : '<i class="fa-regular fa-moon"></i> Switch to dark mode';
    }
  });
}

function toggleTheme() {
  darkMode = !darkMode;
  body.classList.toggle("dark-mode", darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
  updateThemeButtons();
}

document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
  button.addEventListener("click", toggleTheme);
});
// Mobile hamburger menu.
function openMenu() {
  if (!menu || !menuButton) return;
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-label", "Close navigation");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  body.classList.add("menu-is-open");
}

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  body.classList.remove("menu-is-open");
}

if (menuButton) {
  menuButton.addEventListener("click", function () {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

document.querySelectorAll("[data-menu-close]").forEach(function (area) {
  area.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Search form sends the user to the search results page.
document.querySelectorAll("[data-search-form]").forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showToast("Loading products...");

    setTimeout(function () {
      window.location.href = "search.html";
    }, 350);
  });
});

// Category buttons go to Search Results.
document.querySelectorAll(".category-button").forEach(function (button) {
  button.addEventListener("click", function () {
    window.location.href = "search.html";
  });
});
// Compare checkboxes update the comparison tray.
const comparisonTray = document.querySelector(".comparison-tray");
const compareMessage = document.querySelector(".compare-message");

document.querySelectorAll("[data-compare]").forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    selectedProducts = document.querySelectorAll("[data-compare]:checked").length;

    if (selectedProducts > 2) {
      checkbox.checked = false;
      selectedProducts = 2;
      showToast("You can compare up to two products at a time.");
    }

    if (comparisonTray) {
      comparisonTray.hidden = selectedProducts === 0;
    }

    if (compareMessage) {
      compareMessage.textContent = selectedProducts + (selectedProducts === 1 ? " product selected" : " products selected");
    }
  });
});

document.querySelectorAll("[data-clear-compare]").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll("[data-compare]").forEach(function (checkbox) {
      checkbox.checked = false;
    });
    selectedProducts = 0;
    if (comparisonTray) comparisonTray.hidden = true;
  });
});

document.querySelectorAll("[data-compare-now]").forEach(function (button) {
  button.addEventListener("click", function () {
    showToast("Comparison is ready in this prototype.");
  });
});
// Filter drawer on mobile.
const filterDrawer = document.querySelector(".filter-drawer");

function openFilters() {
  if (filterDrawer) {
    filterDrawer.classList.add("is-open");
    filterDrawer.setAttribute("aria-hidden", "false");
  }
}

function closeFilters() {
  if (filterDrawer) {
    filterDrawer.classList.remove("is-open");
    filterDrawer.setAttribute("aria-hidden", "true");
  }
}

document.querySelectorAll("[data-filter-open]").forEach(function (button) {
  button.addEventListener("click", openFilters);
});

document.querySelectorAll("[data-filter-close]").forEach(function (button) {
  button.addEventListener("click", closeFilters);
});

// Remove filter chips when the X is clicked.
document.querySelectorAll("[data-remove-chip]").forEach(function (chip) {
  chip.addEventListener("click", function () {
    chip.remove();
  });
});

document.querySelectorAll("[data-clear-chips]").forEach(function (button) {
  button.addEventListener("click", function () {
    document.querySelectorAll("[data-remove-chip]").forEach(function (chip) {
      chip.remove();
    });
  });
});

document.querySelectorAll("[data-load-more]").forEach(function (button) {
  button.addEventListener("click", function () {
    showToast("All prototype products are already shown.");
  });
});
// Product gallery and product information tabs.
document.querySelectorAll(".gallery-thumb").forEach(function (thumb) {
  thumb.addEventListener("click", function () {
    document.querySelectorAll(".gallery-thumb").forEach(function (item) {
      item.classList.remove("is-selected");
    });
    thumb.classList.add("is-selected");
  });
});

document.querySelectorAll("[data-product-tab]").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll("[data-product-tab]").forEach(function (item) {
      item.classList.remove("is-active");
    });
    tab.classList.add("is-active");
  });
});

// Add to Cart feedback on the product page.
document.querySelectorAll("[data-add-cart]").forEach(function (button) {
  button.addEventListener("click", function () {
    cartCount = cartCount + 1;
    sessionStorage.setItem("cartCount", cartCount);
    updateCartCount();

    const feedback = document.querySelector(".cart-feedback");
    if (feedback) {
      feedback.innerHTML = '<i class="fa-solid fa-check"></i> Cart (' + cartCount + ") updated";
      feedback.hidden = false;
    }

    showToast("Added to cart.");
  });
});
// Support form validation.
const supportForm = document.querySelector("[data-support-form]");

function showFieldMessage(field, isValid, message) {
  const formField = field.closest(".form-field");
  const messageBox = formField.querySelector(".field-message");

  formField.classList.remove("is-error", "is-valid");
  messageBox.hidden = false;
  messageBox.innerHTML = isValid
    ? '<i class="fa-solid fa-check"></i> ' + message
    : '<i class="fa-solid fa-circle-exclamation"></i> ' + message;
  formField.classList.add(isValid ? "is-valid" : "is-error");
}

function validateField(field) {
  const value = field.value.trim();

  if (value === "") {
    showFieldMessage(field, false, "This field is required.");
    return false;
  }

  if (field.name === "email" && !value.includes("@") || field.name === "email" && !value.includes(".")) {
    showFieldMessage(field, false, "Enter a complete email address.");
    return false;
  }

  if (field.name === "name") showFieldMessage(field, true, "Name looks valid.");
  if (field.name === "email") showFieldMessage(field, true, "Email looks valid.");
  if (field.name === "message") showFieldMessage(field, true, "Message looks good.");
  return true;
}

if (supportForm) {
  const fields = supportForm.querySelectorAll("input, textarea");

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      if (field.value.trim() !== "") validateField(field);
    });
  });

  supportForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let formIsValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) formIsValid = false;
    });

    if (formIsValid) {
      document.querySelector("[data-support-view]").hidden = true;
      document.querySelector("[data-success-view]").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Copy the confirmation number if the browser allows it.
document.querySelectorAll("[data-copy-confirmation]").forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.clipboard.writeText("#123456");
    showToast("Confirmation number copied.");
  });
});