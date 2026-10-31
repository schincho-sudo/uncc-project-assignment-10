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

// This short list is only used for live search suggestions.
const assignment11Products = [
  { title: "MSI Katana 15 Gaming Laptop", category: "Laptops", details: "Intel Core i7, RTX 4060, 16GB RAM" },
  { title: "Cooler Master Elite Liquid 240", category: "Components", details: "Quiet desktop cooling for gaming and streaming" },
  { title: "ASUS Zenbook 14 Creator Laptop", category: "Laptops", details: "OLED display, AMD Ryzen 7, 16GB RAM" },
  { title: 'ASUS ROG Strix OLED 32" Monitor', category: "Monitors", details: "4K gaming display with a high refresh rate" },
  { title: "PlayStation 5 Slim Disc Console", category: "Gaming", details: "Console with haptic feedback and 3D audio" },
  { title: "MSI MAG Coreliquid A13 360 Black", category: "Components", details: "AIO cooling for custom desktop systems" },
];

let assignment11SearchTimer;

// Small button loading helper

function assignment11SetButtonLoading(button, message) {
  if (!button || button.dataset.assignment11Loading === "true") return;

  button.dataset.assignment11Loading = "true";
  button.dataset.assignment11OriginalText = button.innerHTML;
  button.disabled = true;
  button.classList.add("is-loading");
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + message;
}

function assignment11ResetButton(button) {
  if (!button) return;

  button.disabled = false;
  button.classList.remove("is-loading");
  button.dataset.assignment11Loading = "false";

  if (button.dataset.assignment11OriginalText) {
    button.innerHTML = button.dataset.assignment11OriginalText;
  }
}

// Live search suggestions
function assignment11FindMatches(query) {
  const searchText = query.trim().toLowerCase();

  if (searchText === "") return assignment11Products;

  return assignment11Products.filter(function (product) {
    const allProductText = product.title + " " + product.category + " " + product.details;
    return allProductText.toLowerCase().includes(searchText);
  });
}

function assignment11ShowSuggestions(suggestionBox, query) {
  const matches = assignment11FindMatches(query).slice(0, 4);
  suggestionBox.innerHTML = "";

  // When the input is empty, hide the suggestion dropdown.
  if (query.trim() === "") {
    suggestionBox.hidden = true;
    return;
  }

  // When no product matches, display a clear message.
  if (matches.length === 0) {
    suggestionBox.innerHTML = '<p class="live-suggestion-empty"><i class="fa-solid fa-magnifying-glass"></i> No products found</p>';
    suggestionBox.hidden = false;
    return;
  }

  matches.forEach(function (product) {
    const suggestion = document.createElement("button");
    suggestion.className = "live-suggestion";
    suggestion.type = "button";
    suggestion.innerHTML =
      '<span class="live-suggestion-icon"><i class="fa-solid fa-magnifying-glass"></i></span>' +
      "<span><strong>" + product.title + "</strong><small>" +
      product.category + " · " + product.details + "</small></span>";

    suggestion.addEventListener("click", function () {
      assignment11StartPageLoading("search.html?query=" + encodeURIComponent(product.title), "search");
    });

    suggestionBox.appendChild(suggestion);
  });

  suggestionBox.hidden = false;
}
function assignment11SyncSearchInputs(currentInput, value) {
  document.querySelectorAll("[data-search-form] input[name='query']").forEach(function (input) {
    if (input !== currentInput) input.value = value;
  });
}

// Make a suggestion dropdown for each desktop or mobile search input.
document.querySelectorAll("[data-search-form] input[name='query']").forEach(function (input) {
  const inputWrap = input.closest(".search-input-wrap");
  if (!inputWrap) return;

  const suggestionBox = document.createElement("div");
  suggestionBox.className = "live-suggestions";
  suggestionBox.hidden = true;
  suggestionBox.setAttribute("role", "listbox");
  inputWrap.appendChild(suggestionBox);

  input.addEventListener("input", function () {
    assignment11SyncSearchInputs(input, input.value);
    assignment11ShowSuggestions(suggestionBox, input.value);
    assignment11UpdateSearchResults(input.value, true);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim() !== "") {
      assignment11ShowSuggestions(suggestionBox, input.value);
    }
  });

  input.addEventListener("blur", function () {
    setTimeout(function () {
      suggestionBox.hidden = true;
    }, 160);
  });
});
// Search Results skeleton and empty state
const assignment11ResultsGrid = document.querySelector(".results-grid");
const assignment11ResultsArea = document.querySelector(".results-area") ||
  (assignment11ResultsGrid ? assignment11ResultsGrid.parentElement : null);
const assignment11ResultsMeta = document.querySelector(".results-meta");
let assignment11LoadingBox;
let assignment11EmptyBox;

if (assignment11ResultsGrid && assignment11ResultsArea) {
  assignment11LoadingBox = document.createElement("div");
  assignment11LoadingBox.className = "live-search-loading";
  assignment11LoadingBox.hidden = true;
  assignment11LoadingBox.innerHTML =
    '<div class="loading-heading"><span class="loader"></span>' +
    '<div><h2>Searching products...</h2>' +
    '<p>Updating your results.</p></div></div>' +
    '<div class="skeleton-grid">' +
    '<div class="skeleton-card"><div></div><i></i><i></i><i></i></div>' +
    '<div class="skeleton-card"><div></div><i></i><i></i><i></i></div>' +
    '<div class="skeleton-card"><div></div><i></i><i></i><i></i></div>' +
    "</div>";

  assignment11EmptyBox = document.createElement("div");
  assignment11EmptyBox.className = "live-empty-state";
  assignment11EmptyBox.hidden = true;
  assignment11EmptyBox.innerHTML =
    '<i class="fa-solid fa-magnifying-glass"></i>' +
    '<h2>No products found</h2>' +
    '<p>Try a different product name, category, or keyword.</p>';

  assignment11ResultsGrid.insertAdjacentElement(
    "beforebegin",
    assignment11LoadingBox
  );
  assignment11ResultsGrid.insertAdjacentElement(
    "afterend",
    assignment11EmptyBox
  );
  assignment11ResultsArea.setAttribute("aria-busy", "false");
}

function assignment11UpdateSearchResults(query, showLoading) {
  if (!assignment11ResultsGrid) return;

  clearTimeout(assignment11SearchTimer);

  function finishSearch() {
    const searchText = query.trim().toLowerCase();
    let matchCount = 0;

    assignment11ResultsGrid.querySelectorAll(".product-card").forEach(function (card) {
      const cardMatches = searchText === "" ||
        card.textContent.toLowerCase().includes(searchText);
      card.hidden = !cardMatches;
      if (cardMatches) matchCount = matchCount + 1;
    });

    if (assignment11LoadingBox) assignment11LoadingBox.hidden = true;
    if (assignment11EmptyBox) assignment11EmptyBox.hidden = matchCount !== 0;

    assignment11ResultsGrid.hidden = matchCount === 0;
    assignment11ResultsArea.setAttribute("aria-busy", "false");

    const loadMoreButton = document.querySelector("[data-load-more]");
    if (loadMoreButton) loadMoreButton.hidden = matchCount === 0;

    if (assignment11ResultsMeta) {
      if (matchCount === 0) {
        assignment11ResultsMeta.textContent = 'No matches for "' + query + '"';
      } else if (searchText === "") {
        assignment11ResultsMeta.textContent = matchCount + " products available";
      } else {
        assignment11ResultsMeta.textContent = matchCount +
          (matchCount === 1 ? " product found" : " products found") +
          ' for "' + query + '"';
      }
    }

    assignment11ResultsGrid.classList.remove("live-results-updated");
    void assignment11ResultsGrid.offsetWidth;
    assignment11ResultsGrid.classList.add("live-results-updated");
  }

  if (!showLoading) {
    finishSearch();
    return;
  }

  assignment11ResultsGrid.hidden = true;
  if (assignment11LoadingBox) assignment11LoadingBox.hidden = false;
  if (assignment11EmptyBox) assignment11EmptyBox.hidden = true;
  assignment11ResultsArea.setAttribute("aria-busy", "true");

  if (assignment11ResultsMeta) {
    assignment11ResultsMeta.textContent = "Searching products...";
  }

  assignment11SearchTimer = setTimeout(finishSearch, 420);
}

// Read a search word from the URL after Search Results opens.
if (assignment11ResultsGrid) {
  const assignment11QueryFromUrl =
    new URLSearchParams(window.location.search).get("query");

  if (assignment11QueryFromUrl) {
    document.querySelectorAll("[data-search-form] input[name='query']").forEach(function (input) {
      input.value = assignment11QueryFromUrl;
    });
    assignment11UpdateSearchResults(assignment11QueryFromUrl, true);
  } else {
    assignment11UpdateSearchResults("", false);
  }
}