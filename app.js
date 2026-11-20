// Track cart, theme, product selection, and Load More status
let cartCount = Number(sessionStorage.getItem("cartCount")) || 0;
let darkMode = localStorage.getItem("theme") === "dark";
let selectedProducts = 0;
let extraProductsLoaded = false;

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
  document.documentElement.dataset.theme = darkMode ? "dark" : "light";

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
        ? '<i class="fa-regular fa-moon" aria-hidden="true"></i>'
        : '<i class="fa-regular fa-sun" aria-hidden="true"></i>';
    }

    if (label) {
      label.textContent = darkMode ? "Dark mode: On" : "Dark mode: Off";
      button.setAttribute("aria-label", label.textContent);
      button.setAttribute("aria-pressed", String(darkMode));
    } else {
      const action = darkMode
        ? "Switch to light mode"
        : "Switch to dark mode";

      button.innerHTML = darkMode
        ? '<i class="fa-regular fa-sun" aria-hidden="true"></i> ' + action
        : '<i class="fa-regular fa-moon" aria-hidden="true"></i> ' + action;

      button.setAttribute("aria-label", action);
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

  const headerHeight = document.querySelector(".site-header")
    .getBoundingClientRect().bottom;

  document.documentElement.style.setProperty(
    "--mobile-menu-top",
    Math.max(0, headerHeight) + "px"
  );

  document.querySelector("main").inert = true;
  document.querySelector("footer").inert = true;

  const firstLink = menu.querySelector("a");
  if (firstLink) firstLink.focus();
}

function closeMenu() {
  if (!menu || !menuButton) return;

  const wasOpen = menu.classList.contains("is-open");

  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");

  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';

  body.classList.remove("menu-is-open");

  document.querySelector("main").inert = false;
  document.querySelector("footer").inert = false;

  if (wasOpen) menuButton.focus();
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

    const panel = filterDrawer.querySelector(".filter-drawer__panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Product filters");

    const close = filterDrawer.querySelector("button[data-filter-close]");
    if (close) close.focus();
  }
}

function closeFilters() {
  if (filterDrawer) {
    const wasOpen = filterDrawer.classList.contains("is-open");

    filterDrawer.classList.remove("is-open");
    filterDrawer.setAttribute("aria-hidden", "true");

    const trigger = document.querySelector("[data-filter-open]");
    if (wasOpen && trigger) trigger.focus();
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
    const gallery = thumb.closest(".gallery");
    const mainImage = gallery.querySelector(".gallery-main-image");
    const thumbnailImage = thumb.querySelector("img");

    if (!mainImage || !thumbnailImage) return;

    // Display the clicked thumbnail as the large image.
    mainImage.src = thumbnailImage.src;
    mainImage.alt = thumbnailImage.alt;

    // Highlight the selected thumbnail.
    gallery.querySelectorAll(".gallery-thumb").forEach(function (item) {
      item.classList.remove("is-selected");
      item.setAttribute("aria-pressed", "false");
    });

    thumb.classList.add("is-selected");
    thumb.setAttribute("aria-pressed", "true");
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

// Copy the confirmation number 
document.querySelectorAll("[data-copy-confirmation]").forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.clipboard.writeText("#123456");
    showToast("Confirmation number copied.");
  });
});

// This short list is used for live search suggestions.
const assignment11Products = [
    {
    id: "msikatana",
    title: "MSI Katana 15 Gaming Laptop",
    category: "Laptops",
    details: '15.6" Full HD 144Hz · Intel Core i7 · RTX 4060 · 16GB RAM',
    price: 499.99,
    stars: 5,
    reviews: 892,
    image: "MSIKatana.png",
    goodFor: "School, PC gaming, and multitasking",
    overview: "Dedicated graphics and a high-refresh screen for PC gaming and everyday work. Performance depends on the game, settings, and power mode.",
    specs: [
      ["Screen", "15.6-inch Full HD, 144Hz — smoother motion when games supply matching frames."],
      ["Processor", "Intel Core i7 — supports everyday work and multitasking."],
      ["Graphics", "RTX 4060 Laptop GPU — dedicated graphics for supported games and creative apps."],
      ["Memory", "16GB RAM — working room for multiple apps and browser tabs."],
      ["Storage", "1TB SSD in the researched reference — space for apps, files, and games."]
    ],
    fullSpecs: [
      ["Reference model", "B13VFK-1264US: Core i7-13620H, 16GB DDR5, RTX 4060, and 1TB SSD."],
      ["Connections", "B13V family: USB, HDMI, Ethernet, Wi-Fi 6, and Bluetooth. Confirm the exact unit."]
    ],
    note: "Reference configuration: B13VFK-1264US. The exact catalog SKU needs confirmation.",
    related: ["asuszenbook", "lenovo", "acer"]
  },
  {
    id: "coolermaster",
    title: "Cooler Master Elite Liquid 240",
    category: "PC Cooling",
    details: "240mm CPU liquid cooler · Two 120mm fans · ARGB lighting",
    price: 999.99,
    stars: 5,
    reviews: 29,
    image: "CoolerMaster.png",
    photo: "CoolerMasterReference.png",
    goodFor: "Desktop CPU cooling",
    overview: "A cooling component for a compatible desktop build, not a complete computer. Check your CPU socket and case clearance before choosing it.",
    specs: [
      ["Cooler type", "CPU liquid cooler — uses a radiator-and-pump loop; not a desktop PC."],
      ["Radiator and fans", "240mm radiator and two 120mm fans — check mounting space and clearance."],
      ["CPU sockets", "Intel LGA 1851/1700 and AMD AM5/AM4 — confirm support for your board."],
      ["Setup", "Pre-installed bracket and thermal paste — fewer preparation steps."],
      ["Lighting", "Addressable RGB — requires compatible lighting connections."]
    ],
    fullSpecs: [
      ["Pump and tubing", "Family specification: dual-chamber pump and 400mm tubing for radiator routing."],
      ["Fit check", "Check radiator and fan thickness, socket mounting, and the installation manual."]
    ],
    note: "Proposed Black variant photo. Exact color/SKU needs confirmation; the price is sample data.",
    related: ["msimag"]
  },
  {
    id: "asuszenbook",
    title: "ASUS Zenbook 14 Creator Laptop",
    category: "Laptops",
    details: "UM3402 reference · 14-inch OLED · Ryzen 7 · 16GB RAM",
    price: 299.99,
    stars: 5,
    reviews: 298,
    image: "AsusZenbook.png",
    photo: "ZenbookReference.png",
    goodFor: "Portable everyday and creative work",
    overview: "This UM3402 reference combines a detailed OLED screen with an everyday-work configuration. Integrated graphics are not a dedicated gaming GPU.",
    specs: [
      ["Screen", "14-inch 2.8K OLED touchscreen — detailed viewing and a taller workspace."],
      ["Processor", "Ryzen 7 5825U — supports everyday multitasking."],
      ["Graphics", "Integrated AMD Radeon — suited to everyday work, not a dedicated gaming GPU."],
      ["Memory and storage", "16GB memory and 1TB SSD — working room and local file space."],
      ["Connections", "USB-C, USB-A, HDMI, and microSD — connect common accessories."]
    ],
    fullSpecs: [
      ["Battery capacity", "75Wh in the reference listing — a capacity figure, not a runtime promise."],
      ["Wireless", "Wi-Fi 6E and Bluetooth 5.2 in the reference; supported equipment and region matter."]
    ],
    note: "Reference configuration: UM3402. Confirm the exact catalog SKU.",
    related: ["acer", "lenovo", "msikatana"]
  },
  {
    id: "asusrog",
    title: 'ASUS ROG Strix OLED 32" 4K TrueBlack Glossy Tandem',
    category: "Monitors",
    details: "4K OLED · Dual mode: 4K/240Hz or Full HD/480Hz · Glossy finish",
    price: 699.99,
    stars: 5,
    reviews: 229,
    image: "AsusRog.png",
    goodFor: "Detailed gaming and high-refresh play",
    overview: "Choose between a detailed 4K mode and a higher-refresh Full HD mode. These are display capabilities, not promised game frame rates.",
    specs: [
      ["Screen", "31.5-inch / 32-inch-class 4K OLED — detailed images and deep blacks."],
      ["Refresh modes", "Up to 4K/240Hz or Full HD/480Hz — choose detail or a higher refresh mode."],
      ["Finish", "Glossy screen — consider reflections in a bright room."],
      ["Video inputs", "HDMI 2.1 and DisplayPort 1.4 — connect supported source devices."],
      ["OLED care", "Pixel-cleaning tools help reduce static-image risk; they do not guarantee no burn-in."]
    ],
    fullSpecs: [
      ["Mode requirements", "Your device, cable, input, and game must support the desired resolution and refresh mode."],
      ["Model check", "Confirm XG32UCWMG versus XG32UQWMS before using model-specific HDR or USB features."]
    ],
    note: "Exact monitor model to confirm. A console may not support every advertised refresh mode.",
    related: ["msikatana", "ps5", "logitechg502"]
  },
    {
    id: "ps5",
    title: "PlayStation 5 Slim Disc Console",
    category: "Game consoles",
    details: "Slim Disc edition · 1TB SSD reference · DualSense controller",
    price: 649.99,
    stars: 5,
    reviews: 143,
    image: "PS5.png",
    goodFor: "Disc games and living-room play",
    overview: "The disc edition supports compatible physical games and movie discs as well as downloads. Confirm the exact model, region, and seller bundle.",
    specs: [
      ["Disc support", "Supported PS5/PS4 games and movie discs — physical-media flexibility."],
      ["Storage", "Nominal 1TB SSD in the reference — usable space is lower after system software."],
      ["Controller", "One DualSense in the reference package — confirm bundle contents."],
      ["Display", "4K/HDR and up to 120Hz output — needs supported games, display, and setup."],
      ["Audio", "Tempest 3D AudioTech — supported content and audio setup are required."]
    ],
    fullSpecs: [
      ["Setup", "Confirm included cables, horizontal feet, and accessories with the seller."],
      ["Stand", "The vertical stand is separate in the referenced package; check the intended setup."]
    ],
    note: "Exact model, bundle, and region to confirm. The Xbox/Windows game in this catalog is not a PS5 game.",
    related: ["asusrog", "headphones"]
  },
  {
    id: "msimag",
    title: "MSI MAG Coreliquid A13 360 Black",
    category: "PC Cooling",
    details: "360mm CPU liquid cooler · Three PWM fans · ARGB lighting",
    price: 89.99,
    stars: 5,
    reviews: 76,
    image: "MSIMag.png",
    goodFor: "Desktop CPU cooling in cases with suitable space",
    overview: "A desktop CPU cooler with a 360mm radiator. Check the complete radiator-and-fan clearance; it is not a laptop accessory or GPU cooler.",
    specs: [
      ["Radiator", "360mm format — your case needs a suitable mount and clearance."],
      ["Fans", "Three 120mm PWM fans — adjustable speed with compatible control."],
      ["CPU sockets", "Intel LGA 1700/1851 and AMD AM4/AM5 — check your motherboard socket."],
      ["Cold plate", "Copper contact plate — transfers CPU heat into the liquid loop."],
      ["Lighting", "5V 3-pin ARGB — do not connect to a 12V 4-pin RGB header."]
    ],
    fullSpecs: [
      ["Radiator dimensions", "A13 360 family: about 394 × 119.6 × 27mm; fan thickness is additional."],
      ["Tubing", "390mm tubing in the family specification — plan routing around your components."]
    ],
    note: "Black model CLA13360. Check the manual, socket area, and full radiator/fan clearance.",
    related: ["coolermaster"]
  },
  {
    id: "logitechg502",
    title: "Logitech G502 HERO High Performance Wired Gaming Mouse",
    category: "Computer peripherals",
    details: "USB wired · 11 programmable buttons · Adjustable weights · LIGHTSYNC RGB",
    price: 34.50,
    stars: 5,
    reviews: 76,
    image: "LogitechG502.png",
    goodFor: "Customizable gaming and everyday controls",
    overview: "A wired mouse with configurable controls, weight tuning, and two scroll modes. It needs no battery charging or wireless pairing.",
    specs: [
      ["Connection", "USB wired — requires a suitable USB port and a cable during use."],
      ["Sensor", "100–25,600 DPI — adjust pointer sensitivity; higher DPI does not guarantee better aim."],
      ["Buttons", "11 programmable buttons — assign shortcuts through Logitech G HUB."],
      ["Weight tuning", "Five removable 3.6g weights — adjust weight and balance."],
      ["Scroll wheel", "Dual-mode scrolling — switch between stepped and fast scrolling."]
    ],
    fullSpecs: [
      ["Model", "Wired G502 HERO, reference part 910-005469; not G502 LIGHTSPEED or G502 X."],
      ["Lighting", "LIGHTSYNC RGB — optional cosmetic customization through Logitech software."]
    ],
    note: "Button customization uses Logitech G HUB. Check device and software support.",
    related: ["headphones", "razerheadset"]
  },
  {
    id: "razerheadset",
    title: "Razer BlackShark V2 HyperSpeed Wireless Gaming Headset",
    category: "Computer peripherals",
    details: "2.4GHz wireless · Bluetooth · USB wired mode · Boom microphone",
    price: 108.99,
    stars: 5,
    reviews: 639,
    image: "RazerHeadset.png",
    goodFor: "Wireless gaming and voice chat",
    overview: "Several connection options let you choose a setup for a supported device. Check device compatibility rather than assuming every console works the same way.",
    specs: [
      ["Connections", "Wireless dongle, Bluetooth, or USB — choose a supported connection for your setup."],
      ["Battery", "Manufacturer states up to 70 hours — actual runtime varies with use."],
      ["Microphone", "Bendable boom mic — position it for voice chat."],
      ["Weight", "280g for the researched offer — compare weight before choosing your fit."],
      ["Ear cushions", "Memory foam — comfort and passive isolation depend on personal fit."]
    ],
    fullSpecs: [
      ["Charging", "USB-C charging; fast-charge claims depend on manufacturer test conditions."],
      ["Spatial audio", "THX software requires supported Windows software; it is not universal across consoles."]
    ],
    note: "White Edition image. Confirm the exact color SKU and connection support for your device.",
    related: ["headphones", "logitechg502"]
  },

    {
    id: "videogame",
    title: "Call of Duty: Modern Warfare 4",
    category: "Software",
    details: "Xbox Series X|S and Windows · Standard edition · Digital code",
    price: 69.99,
    stars: 5,
    reviews: 146,
    image: "VideoGame.png",
    goodFor: "Story missions and online matches on supported platforms",
    overview: "A standard-edition digital-code reference for Xbox Series X|S and Windows. Check the redemption region, device, and online requirements; no physical disc is included.",
    specs: [
      ["Platform", "Xbox Series X|S and Windows — confirm your device; not Xbox One or PS5."],
      ["Format", "Standard digital code — no physical disc included."],
      ["Modes", "Campaign, Multiplayer, and DMZ — choose story or online play."],
      ["Online access", "Activision account required; console multiplayer needs a separate subscription."],
      ["Edition", "Base game — no Vault Edition bonuses implied."]
    ],
    fullSpecs: [
      ["Reference listing", "Newegg item N82E16832701126, model G7Q-00461. Confirm redemption terms."],
      ["Release date", "The researched sources conflict; the release date is not treated as confirmed here."]
    ],
    note: "Check region and account requirements. Related peripherals are browsing options, not Xbox compatibility claims.",
    related: ["logitechg502", "razerheadset"]
  },
  {
    id: "lenovo",
    title: "Lenovo LOQ 15ARP10 Gaming Laptop",
    category: "Laptops",
    details: '15.6" Full HD 144Hz · Ryzen 7 170 · NVIDIA GeForce RTX 4050',
    price: 1379.00,
    stars: 4,
    reviews: 737,
    image: "lenovo.png",
    goodFor: "PC gaming and multitasking",
    overview: "A gaming-laptop family with dedicated RTX graphics and a high-refresh display. Confirm the seller's memory and storage configuration before comparing offers.",
    specs: [
      ["Processor", "Ryzen 7 170 — supports games and everyday multitasking."],
      ["Graphics", "RTX 4050 Laptop GPU — dedicated graphics for supported games and creative apps."],
      ["Screen", "15.6-inch Full HD, 144Hz — smoother motion when games supply matching frames."],
      ["Connections", "Platform reference: Wi-Fi 6, Ethernet, HDMI, and USB — confirm exact ports."],
      ["Memory and storage", "Capacity to confirm — seller offers differ; do not assume a particular RAM/SSD size."]
    ],
    fullSpecs: [
      ["Variant check", "Confirm the exact seller item and machine type before using detailed platform specifications."],
      ["Seller upgrades", "Some offers are seller-upgraded; check configuration and coverage separately."]
    ],
    note: "Exact RAM, storage, and ports need confirmation. No capacity is inferred from the picture.",
    related: ["msikatana", "acer", "asuszenbook"]
  },
  {
    id: "headphones",
    title: "Logitech G G325 LIGHTSPEED Wireless Gaming Headset",
    category: "Computer peripherals",
    details: "LIGHTSPEED wireless · Bluetooth · Built-in microphone",
    price: 79.99,
    stars: 5,
    reviews: 407,
    image: "headphones.png",
    goodFor: "Gaming and calls across supported devices",
    overview: "A wireless headset with receiver and Bluetooth connection options. Its microphone is built into the headset; there is no external boom.",
    specs: [
      ["Wireless modes", "LIGHTSPEED receiver and Bluetooth — choose the connection for your setup."],
      ["Platforms", "PC, PS5, and Switch support listed by Logitech — verify the connection mode."],
      ["Microphone", "Built-in beamforming mic — voice chat without an external boom."],
      ["Battery", "Manufacturer states 24+ hours — actual runtime varies."],
      ["Weight", "212g — compare weight and fit before choosing."]
    ],
    fullSpecs: [
      ["Padding", "Knit fabric and memory-foam earcups — comfort depends on fit and personal preference."],
      ["Audio format", "24-bit audio listed — results depend on content, software, and connection."]
    ],
    note: "Platform support varies by connection. Microphone noise reduction is not active noise cancellation.",
    related: ["razerheadset", "logitechg502"]
  },
  {
    id: "acer",
    title: 'Acer Aspire Go 15, 15.6" Full HD IPS Display, AMD Ryzen',
    category: "Laptops",
    details: "Ryzen 7 7730U · 32GB memory · 1TB SSD · Integrated AMD Radeon",
    price: 929.00,
    stars: 4,
    reviews: 489,
    image: "Acer.png",
    goodFor: "Everyday work and multitasking",
    overview: "A large everyday workspace with substantial memory for browsing and office apps. This AG15-42P-R3GM reference uses integrated graphics, not a dedicated gaming GPU.",
    specs: [
      ["Screen", "15.6-inch Full HD IPS, 60Hz — clear everyday viewing; non-touch."],
      ["Processor", "Ryzen 7 7730U — supports office work and multitasking."],
      ["Memory", "32GB DDR4 — working room for more tabs and apps."],
      ["Storage", "1TB SSD — space for documents, applications, and media."],
      ["Connections", "USB-C, USB-A, HDMI, and Ethernet — connect everyday accessories."]
    ],
    fullSpecs: [
      ["Graphics", "Integrated AMD Radeon — assess graphics-heavy applications separately."],
      ["Battery claim", "Up to 9.5 hours in a listed test; actual runtime varies with settings and use."]
    ],
    note: "Reference configuration: AG15-42P-R3GM. Other Aspire Go 15 variants differ.",
    related: ["asuszenbook", "lenovo", "msikatana"]
  }
];

// Helpers for displaying product information.
function findProduct(id) {
  return assignment11Products.find(function (product) {
    return product.id === id;
  });
}

function productPhoto(product) {
  return "./assets/" + (product.photo || product.image);
}

function formatPrice(price) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function escapeProductText(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

function productRating(product) {
  return "★".repeat(product.stars) +
    "☆".repeat(5 - product.stars) +
    " <span>" + product.reviews + "</span>";
}

// Give each existing product card its correct information and link.
function updateProductCard(card, product) {
  card.dataset.productId = product.id;

  const image = card.querySelector(".product-card__media img");
  image.src = productPhoto(product);
  image.alt = product.title;

  card.querySelector("h3").textContent = product.title;
  card.querySelector(".product-card__eyebrow").textContent = product.category;
  card.querySelector(".product-card__desc").textContent = product.details;
  card.querySelector(".product-card__price").textContent =
    formatPrice(product.price);

  const rating = card.querySelector(".rating");
  rating.innerHTML = productRating(product);
  rating.setAttribute("role", "img");
  rating.setAttribute(
    "aria-label",
    "Sample rating: " + product.stars +
    " out of 5 stars, " + product.reviews + " sample reviews"
  );

  const link = card.querySelector(".product-card__actions a");

  if (link) {
    link.href = "product.html?id=" + product.id;
    link.setAttribute(
      "aria-label",
      "View " + product.title + " details"
    );
  }
}

// Identify each existing card using its image filename.
document.querySelectorAll(".product-card").forEach(function (card) {
  const image = card.querySelector(".product-card__media img");
  if (!image) return;

  const filename = image.getAttribute("src").split("/").pop();

  const product = assignment11Products.find(function (item) {
    return item.image === filename || item.photo === filename;
  });

  if (product) {
    updateProductCard(card, product);
  }
});

// Build a simple specifications table.
function makeSpecsTable(rows, caption) {
  return '<table class="product-spec-table">' +
    '<caption class="sr-only">' + escapeProductText(caption) + '</caption>' +
    '<thead><tr>' +
    '<th scope="col">Feature</th>' +
    '<th scope="col">What it means for you</th>' +
    '</tr></thead><tbody>' +
    rows.map(function (row) {
      return '<tr>' +
        '<th scope="row">' + escapeProductText(row[0]) + '</th>' +
        '<td>' + escapeProductText(row[1]) + '</td>' +
        '</tr>';
    }).join("") +
    '</tbody></table>';
}

// Build a related-product card using the same catalog.
function relatedProductCard(product) {
  return '<article class="product-card">' +
    '<div class="product-card__media">' +
    '<img class="product-image" src="' + productPhoto(product) +
    '" alt="' + escapeProductText(product.title) + '" loading="lazy">' +
    '</div>' +
    '<div class="product-card__body">' +
    '<p class="product-card__eyebrow">' +
    escapeProductText(product.category) + '</p>' +
    '<h3>' + escapeProductText(product.title) + '</h3>' +
    '<p class="product-card__desc">' +
    escapeProductText(product.details) + '</p>' +
    '<div class="product-card__price">' +
    formatPrice(product.price) + '</div>' +
    '<div class="rating" role="img" aria-label="Sample rating: ' +
    product.stars + ' out of 5 stars, ' + product.reviews +
    ' sample reviews">' + productRating(product) + '</div>' +
    '</div>' +
    '<div class="product-card__actions">' +
    '<a class="btn btn-primary" href="product.html?id=' +
    product.id + '" aria-label="View ' +
    escapeProductText(product.title) + ' details">View product</a>' +
    '</div></article>';
}

// Display the selected product using the existing product.html layout.
if (document.body.classList.contains("page-product")) {
  const id = new URLSearchParams(location.search).get("id");
  const product = findProduct(id === null ? "msikatana" : id);

  const info = document.querySelector(".product-info");
  const related = document.querySelector(".related-products");

  if (!product) {
    document.title = "Product not found | Newegg Redesign";
    document.querySelector(".product-layout").hidden = true;
    document.querySelector(".product-details").hidden = true;
    related.hidden = true;

    document.querySelector(".back-link").insertAdjacentHTML(
      "afterend",
      '<div class="product-not-found">' +
      '<h1>Product not found</h1>' +
      '<p>Use Back to search results to choose another item.</p>' +
      '</div>'
    );
  } else {
    document.title = product.title + " | Newegg Redesign";
    document.querySelector('meta[name="description"]').content =
      product.details;

    info.querySelector(".section-kicker").textContent = product.category;
    info.querySelector("h1").textContent = product.title;
    info.querySelector(".product-subtitle").textContent = product.details;
    info.querySelector(".product-price").textContent =
      formatPrice(product.price);

    const rating = info.querySelector(".rating");
    rating.innerHTML = productRating(product);
    rating.setAttribute("role", "img");
    rating.setAttribute(
      "aria-label",
      "Sample rating: " + product.stars +
      " out of 5 stars, " + product.reviews + " sample reviews"
    );

    info.querySelector(".good-for p").textContent = product.goodFor;

    const stock = info.querySelector(".stock-status");
    stock.className = "product-demo-note";
    stock.textContent =
      "Sample price and rating · Front-end demo. No real purchase is made.";

    const addButton = info.querySelector("[data-add-cart]");
    addButton.dataset.productId = product.id;
    addButton.setAttribute(
      "aria-label",
      "Add " + product.title + " to the demo cart"
    );

    // Temporary: other products cannot be purchased until checkout is updated.
    addButton.disabled = product.id !== "msikatana";

    info.querySelector("#quantity").max = "999";

    const mainImage = document.querySelector(".gallery-main-image");
    mainImage.src = productPhoto(product);
    mainImage.alt = product.title;

    // Keep MSI's existing gallery. Other products use their own single photo.
    document.querySelectorAll(".gallery-thumb").forEach(function (thumb, index) {
      if (product.id !== "msikatana" && index > 0) {
        thumb.remove();
      } else if (index === 0) {
        thumb.querySelector("img").src = productPhoto(product);
        thumb.querySelector("img").alt = product.title;
      }
    });

    document.querySelector("[data-product-overview]").textContent =
      product.overview;

    document.querySelector("#panel-key-specs").innerHTML =
      makeSpecsTable(product.specs, product.title + " key specifications");

    document.querySelector("#panel-full-specs").innerHTML =
      makeSpecsTable(product.fullSpecs, product.title + " additional specifications");

    const note = document.createElement("p");
    note.className = "product-spec-note";
    note.textContent = product.note;
    document.querySelector(".product-details").appendChild(note);

    const recommended = [];

    product.related.forEach(function (relatedId) {
      const item = findProduct(relatedId);

      if (item && item.id !== product.id && !recommended.includes(item)) {
        recommended.push(item);
      }
    });

    related.hidden = recommended.length === 0;
    related.querySelector(".related-products__grid").innerHTML =
      recommended.slice(0, 3).map(relatedProductCard).join("");
  }
}

// Switch product-information tabs.
const productTabs = Array.from(
  document.querySelectorAll("[data-product-tab]")
);

function activateProductTab(button) {
  productTabs.forEach(function (tab) {
    const active = tab === button;

    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;

    const panel = document.getElementById(
      tab.getAttribute("aria-controls")
    );

    panel.hidden = !active;
  });
}

productTabs.forEach(function (tab, index) {
  tab.addEventListener("click", function () {
    activateProductTab(tab);
  });

  tab.addEventListener("keydown", function (event) {
    let next = index;

    if (event.key === "ArrowRight") {
      next = (index + 1) % productTabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (index + productTabs.length - 1) % productTabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = productTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateProductTab(productTabs[next]);
    productTabs[next].focus();
  });
});



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
    const productText =
      product.title + " " + product.category + " " + product.details;

    return productText.toLowerCase().includes(searchText);
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
    suggestionBox.innerHTML = '<p class="live-suggestion-empty"><i class="fa-solid fa-magnifying-glass"></i> No results found</p>';
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

    // Keep the dropdown open until the click finishes.
    suggestion.addEventListener("mousedown", function (event) {
      if (event.button === 0) event.preventDefault();
    });

    suggestion.addEventListener("click", function () {
      document.querySelectorAll("[data-search-form] input[name='query']").forEach(function (input) {
        input.value = product.title;
      });

      suggestionBox.hidden = true;

      assignment11StartPageLoading(
        "search.html?query=" + encodeURIComponent(product.title),
        "search"
      );
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
    '<h2>No results found</h2>' +
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

    const matches = assignment11FindMatches(query);

    assignment11ResultsGrid.querySelectorAll(".product-card").forEach(function (card) {
      const cardTitle = card.querySelector("h3").textContent.toLowerCase();

      const cardMatches = matches.some(function (product) {
        return card.dataset.productId === product.id;
      });

      const isExtraProduct = card.classList.contains("extra-product");
      const canShow = !isExtraProduct || extraProductsLoaded || searchText !== "";

      card.hidden = !(cardMatches && canShow);

      if (!card.hidden) {
        matchCount = matchCount + 1;
      }
    });


    if (assignment11LoadingBox) assignment11LoadingBox.hidden = true;
    if (assignment11EmptyBox) assignment11EmptyBox.hidden = matchCount !== 0;

    assignment11ResultsGrid.hidden = matchCount === 0;
    assignment11ResultsArea.setAttribute("aria-busy", "false");

    const loadMoreButton = document.querySelector("[data-load-more]");

    if (loadMoreButton) {
      loadMoreButton.hidden = extraProductsLoaded || searchText !== "";
    }

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
// This listener captures the click first so the existing code above stays unchanged.
document.addEventListener("click", function (event) {
  const loadMoreButton = event.target.closest("[data-load-more]");
  const filterButton = event.target.closest(".filter-apply");
  const addToCartButton = event.target.closest("[data-add-cart]");

  if (loadMoreButton) {
    event.preventDefault();
    event.stopImmediatePropagation();

    assignment11SetButtonLoading(loadMoreButton, "Loading...");

    setTimeout(function () {
      extraProductsLoaded = true;

      assignment11ResetButton(loadMoreButton);

      const searchInput = document.querySelector(
        "[data-search-form] input[name='query']"
      );

      const query = searchInput ? searchInput.value : "";

      assignment11UpdateSearchResults(query, false);
      showToast("All products loaded.");
    }, 650);

    return;
  }


  if (filterButton) {
    event.preventDefault();
    event.stopImmediatePropagation();
    assignment11SetButtonLoading(filterButton, "Updating...");

    setTimeout(function () {
      assignment11ResetButton(filterButton);
      closeFilters();
      showToast("Updating results...");
    }, 520);

    return;
  }

  if (addToCartButton) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (addToCartButton.disabled) return;

    const quantityInput = document.querySelector("#quantity");

    if (quantityInput && !quantityInput.reportValidity()) {
      return;
    }

    const quantity = quantityInput
      ? Number(quantityInput.value)
      : 1;

    assignment11SetButtonLoading(addToCartButton, "Adding...");

    setTimeout(function () {
      cartCount = cartCount + quantity;
      sessionStorage.setItem("cartCount", cartCount);
      updateCartCount();

      assignment11ResetButton(addToCartButton);

      const message =
        quantity + (quantity === 1 ? " item" : " items") +
        " added to cart.";

      const feedback = document.querySelector(".cart-feedback");

      if (feedback) {
        feedback.textContent =
          message + " Cart total: " + cartCount + ".";
        feedback.hidden = false;
      }

      showToast(message);
    }, 520);
  }
}, true);
// Support form loading feedback
// This listener keeps the current validation but adds a visible submitting state.
if (supportForm) {
  const assignment11SupportButton =
    supportForm.querySelector("button[type='submit']");
  const assignment11SupportStatus = document.createElement("p");

  assignment11SupportStatus.className = "live-submit-status";
  assignment11SupportStatus.hidden = true;
  supportForm.appendChild(assignment11SupportStatus);

  supportForm.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let formIsValid = true;
    supportForm.querySelectorAll("input, textarea").forEach(function (field) {
      if (!validateField(field)) formIsValid = false;
    });

    if (formIsValid) {
      assignment11SetButtonLoading(
        assignment11SupportButton,
        "Submitting..."
      );
      assignment11SupportStatus.hidden = false;
      assignment11SupportStatus.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> ' +
        'Sending your support request...';

      setTimeout(function () {
        document.querySelector("[data-support-view]").hidden = true;
        document.querySelector("[data-success-view]").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 850);
    }
  }, true);
}

// Full-page skeletons before navigation
function assignment11GetPageLoadingMarkup(pageType) {
  if (pageType === "search") {
    return '<div class="page-loading__heading"><span class="page-loading__spinner"></span><div><h1>Loading search results...</h1><p>Finding the best products for you.</p></div></div>' +
      '<div class="page-loading__search-layout"><aside class="page-loading__filters"><b>FILTERS</b><span></span><span></span><span></span><strong>BRAND</strong><i></i><i></i><i></i><i></i><strong>PRICE RANGE</strong><i></i><i></i><i></i></aside>' +
      '<div class="page-loading__cards"><div class="page-loading__card"></div><div class="page-loading__card"></div><div class="page-loading__card"></div><div class="page-loading__card"></div><div class="page-loading__card"></div><div class="page-loading__card"></div></div></div>';
  }

  if (pageType === "product") {
    return '<div class="page-loading__heading"><span class="page-loading__spinner"></span><div><h1>Loading product details...</h1><p>Getting product information ready.</p></div></div>' +
      '<div class="page-loading__product-layout"><div class="page-loading__product-image"></div><div class="page-loading__product-info"><span></span><h2></h2><p></p><p></p><b></b><i></i><div></div><div></div></div></div>' +
      '<div class="page-loading__specs"><span></span><span></span><span></span><span></span></div>';
  }

  return '<div class="page-loading__heading"><span class="page-loading__spinner"></span><div><h1>Opening support...</h1><p>Loading the support form for you.</p></div></div>' +
    '<div class="page-loading__form"><label>NAME</label><span></span><label>EMAIL</label><span></span><label>MESSAGE</label><div></div><b></b></div>';
}

function assignment11StartPageLoading(url, pageType) {
  if (document.querySelector(".page-loading-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "page-loading-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.innerHTML = '<div class="page-loading__content shell">' + assignment11GetPageLoadingMarkup(pageType) + "</div>";
  document.body.appendChild(overlay);

  requestAnimationFrame(function () {
    overlay.classList.add("is-visible");
  });

  setTimeout(function () {
    window.location.href = url;
  }, 800);
}

// Use page skeletons before going to Search, Product Details, or Support.
document.addEventListener("click", function (event) {
  const link = event.target.closest("a[href]");
  if (!link) return;

  const url = link.getAttribute("href");
  let pageType = "";

  if (!url || url.charAt(0) === "#" || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target) {
    return;
  }

  if (url.indexOf("search.html") === 0) pageType = "search";
  if (url.indexOf("product.html") === 0) pageType = "product";
  if (url.indexOf("support.html") === 0) pageType = "support";

  if (pageType !== "") {
    event.preventDefault();
    event.stopImmediatePropagation();
    assignment11StartPageLoading(url, pageType);
  }
}, true);

// Search Results skeleton when a search form or category button is used.
document.addEventListener("submit", function (event) {
  const form = event.target.closest("[data-search-form]");
  if (!form) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const input = form.querySelector("input[name='query']");
  const button = form.querySelector("button[type='submit']");
  const query = input ? input.value.trim() : "";

  assignment11SetButtonLoading(button, "Searching...");
  setTimeout(function () {
    assignment11StartPageLoading("search.html?query=" + encodeURIComponent(query), "search");
  }, 250);
}, true);

document.addEventListener("click", function (event) {
  const categoryButton = event.target.closest(".category-button");
  if (!categoryButton) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  assignment11StartPageLoading("search.html", "search");
}, true);

// Assignment 12: Support form validation and user feedback.

const assignment12Form = document.querySelector("[data-support-form]");
let assignment12Submitting = false;

function assignment12ValidateField(field) {
  const value = field.value.trim();
  let errorMessage = "";
  let successMessage = "";

  if (field.name === "name") {
    if (value === "") {
      errorMessage = "Please enter your full name.";
    } else if (!/^[\p{L}\p{M} ]+$/u.test(value)) {
      errorMessage = "Use letters and spaces only.";
    } else if (value.length < 2) {
      errorMessage = "Your name must contain at least 2 characters.";
    }

    successMessage = "Name looks valid.";
  }

  if (field.name === "email") {
    // Check for text before @, a domain, and a domain ending.
    const emailFormat = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-zA-Z]{2,}$/;

    if (value === "") {
      errorMessage = "Please enter your email address.";
    } else if (!emailFormat.test(value) || field.validity.typeMismatch) {
      errorMessage = "Enter a valid email address, like name@example.com.";
    }
    successMessage = "Email looks valid.";
  }

  if (field.name === "message") {
    if (value === "") {
      errorMessage = "Please describe your issue or question.";
    } else if (value.length < 15) {
      const remaining = 15 - value.length;

      errorMessage = "Please enter " + remaining + " more " +
        (remaining === 1 ? "character." : "characters.");
    }
    successMessage = "Message looks good.";
  }

  const isValid = errorMessage === "";
  showFieldMessage(field, isValid, isValid ? successMessage : errorMessage);
  field.setAttribute("aria-invalid", isValid ? "false" : "true");
  return isValid;
}

// Sort search results by price.
const sortDropdown = document.querySelector("#sort");
const sortingGrid = document.querySelector(".results-grid");

if (sortDropdown && sortingGrid) {
  // Remember the original product order.
  const originalCards = Array.from(
    sortingGrid.querySelectorAll(".product-card")
  );

  function getProductPrice(card) {
    const priceText = card.querySelector(
      ".product-card__price"
    ).textContent;

    // Remove dollar signs and commas before comparing prices.
    return Number(priceText.replace(/[$,]/g, "").trim());
  }

  function sortProducts() {
    const cardsToSort = originalCards.slice();

    if (sortDropdown.value === "Price: low to high") {
      cardsToSort.sort(function (a, b) {
        return getProductPrice(a) - getProductPrice(b);
      });
    }

    if (sortDropdown.value === "Price: high to low") {
      cardsToSort.sort(function (a, b) {
        return getProductPrice(b) - getProductPrice(a);
      });
    }

    // Move the existing cards into the selected order.
    cardsToSort.forEach(function (card) {
      sortingGrid.appendChild(card);
    });
  }

  sortDropdown.addEventListener("change", sortProducts);
  sortProducts();
}
/* ===================================
   SEARCH RESULTS FILTERS
   =================================== */

const searchPage = document.querySelector(".page-search");

if (searchPage) {
  const grid = searchPage.querySelector(".results-grid");
  const sidebar = searchPage.querySelector(".filters-panel");
  const drawer = searchPage.querySelector(".filter-drawer");
  const chips = searchPage.querySelector(".chips");
  const cards = grid.querySelectorAll(".product-card");

  const brands = [
    "Cooler Master", "PlayStation", "Logitech", "Razer",
    "ASUS", "Acer", "MSI", "Lenovo"
  ];

  function labelOf(input) {
    return input.closest("label").textContent.replace(/\s+/g, " ").trim();
  }

  function groupOf(input) {
    return input.closest(".filter-group").querySelector("h3").textContent.trim();
  }

  // Add extra brand options.
  const brandGroup = sidebar.querySelector(".filter-group");
  const moreButton = brandGroup.querySelector(".filter-more");

  ["Cooler Master", "PlayStation", "Logitech", "Razer"].forEach(function (name) {
    const option = document.createElement("label");
    option.className = "filter-option filter-extra";
    option.hidden = true;
    option.innerHTML = '<input type="checkbox"><span></span>' + name;
    moreButton.before(option);
  });

  // Copy desktop filters to the mobile drawer.
  const mobile = drawer.querySelector(".filter-content");

  mobile.querySelectorAll(".filter-group").forEach(function (group) {
    group.remove();
  });

  sidebar.querySelectorAll(".filter-group").forEach(function (group) {
    mobile.querySelector(".filter-apply").before(group.cloneNode(true));
  });

  // Start with no filters selected.
  searchPage.querySelectorAll(".filter-option input").forEach(function (input) {
    input.checked = false;
  });

  // Get selected filters from a group.
  function selectedOptions(number) {
    const group = sidebar.querySelectorAll(".filter-group")[number];
    return Array.from(group.querySelectorAll("input:checked")).map(labelOf);
  }

  // Check whether a product matches a price range.
  function priceMatches(price, range) {
    if (range === "Under $500") return price < 500;
    if (range === "$500 - $1000") return price >= 500 && price < 1000;
    if (range === "$1000 - $1500") return price >= 1000 && price < 1500;
    return range === "$1500+" && price >= 1500;
  }

  // Keep desktop and mobile checkboxes synchronized.
  function setOption(changed, checked) {
    searchPage.querySelectorAll(".filter-option input").forEach(function (input) {
      if (groupOf(input) === groupOf(changed) &&
        labelOf(input) === labelOf(changed)) {
        input.checked = checked;
      }
    });
  }

  // Clear all filters.
  function clearFilters() {
    searchPage.querySelectorAll(".filter-option input").forEach(function (input) {
      input.checked = false;
    });

    updateFilters();
  }

  // Add a Clear filters button to the empty state.
  const empty = assignment11EmptyBox;
  const clearButton = document.createElement("button");

  clearButton.type = "button";
  clearButton.className = "btn btn-secondary clear-filter-button";
  clearButton.textContent = "Clear filters";
  clearButton.addEventListener("click", clearFilters);

  if (empty) empty.appendChild(clearButton);

  // Main filtering function.
  function updateFilters() {
    const chosenBrands = selectedOptions(0);
    const chosenPrices = selectedOptions(1);
    const chosenGpus = selectedOptions(2);

    const active = chosenBrands.length +
      chosenPrices.length +
      chosenGpus.length > 0;

    const query = searchPage.querySelector("input[name='query']").value.trim();
    const searchResults = assignment11FindMatches(query);

    let count = 0;

    cards.forEach(function (card) {
      const title = card.querySelector("h3").textContent.trim().toLowerCase();
      const description = card.querySelector(".product-card__desc").textContent.toLowerCase();
      const price = Number(
        card.querySelector(".product-card__price").textContent.replace(/[$,]/g, "")
      );

      // Find the brand.
      const brand = brands.find(function (name) {
        return title.startsWith(name.toLowerCase());
      });

      // Find the GPU.
      let gpu = "";

      if (description.includes("rtx")) gpu = "NVIDIA RTX";
      else if (description.includes("amd radeon")) gpu = "AMD Radeon";
      else if (description.includes("intel arc")) gpu = "Intel Arc";

      // Check the search and selected filters.
      const searchOK = searchResults.some(function (item) {
        return card.dataset.productId === item.id;
      });

      const brandOK = !chosenBrands.length || chosenBrands.includes(brand);
      const gpuOK = !chosenGpus.length || chosenGpus.includes(gpu);

      const priceOK = !chosenPrices.length || chosenPrices.some(function (range) {
        return priceMatches(price, range);
      });

      const loaded = active || query !== "" || extraProductsLoaded ||
        !card.classList.contains("extra-product");

      // Show only matching products.
      card.hidden = !(searchOK && brandOK && priceOK && gpuOK && loaded);

      if (!card.hidden) {
        count++;
      } else {
        const compare = card.querySelector("[data-compare]");
        if (compare) compare.checked = false;
      }
    });

    // Update the comparison tray.
    selectedProducts = searchPage.querySelectorAll("[data-compare]:checked").length;

    if (comparisonTray) comparisonTray.hidden = selectedProducts === 0;

    if (compareMessage) {
      compareMessage.textContent = selectedProducts +
        (selectedProducts === 1 ? " product selected" : " products selected");
    }

    // Update the product count and empty state.
    grid.hidden = count === 0;

    if (assignment11LoadingBox) assignment11LoadingBox.hidden = true;
    if (assignment11ResultsArea) {
      assignment11ResultsArea.setAttribute("aria-busy", "false");
    }

    if (empty) {
      empty.hidden = count !== 0;
      empty.querySelector("h2").textContent =
        active ? "No products match these filters" : "No results found";

      empty.querySelector("p").textContent =
        active ? "Try removing a filter to see more products." :
          "Try a different search.";

      clearButton.hidden = !active;
    }

    assignment11ResultsMeta.textContent = count +
      (count === 1 ? " product found" : " products found") +
      (query ? ' for "' + query + '"' : "");

    searchPage.querySelector("[data-load-more]").hidden =
      active || extraProductsLoaded || query !== "";

    // Create removable filter chips.
    chips.replaceChildren();

    sidebar.querySelectorAll(".filter-option input:checked").forEach(function (input) {
      const chip = document.createElement("button");

      chip.type = "button";
      chip.className = "chip";
      chip.textContent = labelOf(input) + " x";

      chip.addEventListener("click", function () {
        setOption(input, false);
        updateFilters();
      });

      chips.appendChild(chip);
    });

    chips.hidden = !active;

    if (active) {
      const clear = document.createElement("button");

      clear.type = "button";
      clear.className = "chip chip-clear";
      clear.textContent = "Clear all";
      clear.addEventListener("click", clearFilters);

      chips.appendChild(clear);
    }

    // Reuse the existing product fade animation.
    grid.classList.remove("live-results-updated");
    void grid.offsetWidth;
    grid.classList.add("live-results-updated");
  }

  // Update products when a checkbox changes.
  searchPage.addEventListener("change", function (event) {
    if (!event.target.matches(".filter-option input")) return;

    clearTimeout(assignment11SearchTimer);
    setOption(event.target, event.target.checked);
    updateFilters();
  });

  // Make See more and See less work.
  searchPage.addEventListener("click", function (event) {
    const button = event.target.closest(".filter-more");
    if (!button) return;

    const open = button.textContent.includes("See more");

    button.closest(".filter-group").querySelectorAll(".filter-extra").forEach(function (option) {
      option.hidden = !open;
    });

    button.textContent = open ? "See less -" : "See more +";
  });

  // Keep the original live search and Load More working.
  const originalSearch = assignment11UpdateSearchResults;
  let searchTimer;

  assignment11UpdateSearchResults = function (query, loading) {
    originalSearch(query, loading);
    clearTimeout(searchTimer);

    if (loading) {
      searchTimer = setTimeout(updateFilters, 450);
    } else {
      updateFilters();
    }
  };

  // Show the correct results when the page opens.
  if (new URLSearchParams(window.location.search).get("query")) {
    setTimeout(updateFilters, 470);
  } else {
    updateFilters();
  }
}
if (assignment12Form) {
  const fields = assignment12Form.querySelectorAll("input, textarea");
  const submitButton = assignment12Form.querySelector("button[type='submit']");
  const supportView = document.querySelector("[data-support-view]");
  const successView = document.querySelector("[data-success-view]");
  const submitStatus = assignment12Form.querySelector(".live-submit-status");

  // The original blur listeners now use the improved validation rules too.
  validateField = assignment12ValidateField;
  fields.forEach(function (field) {
    const messageBox = field.closest(".form-field").querySelector(".field-message");
    const hint = document.createElement("p");

    hint.className = "form-hint";
    hint.id = field.id + "-hint";
    messageBox.id = field.id + "-feedback";
    messageBox.setAttribute("aria-live", "polite");
    messageBox.setAttribute("aria-atomic", "true");

    field.required = true;
    field.setAttribute("aria-describedby", hint.id + " " + messageBox.id);

    if (field.name === "name") {
      hint.textContent = "Enter your name using at least 2 characters.";
      field.minLength = 2;
      field.autocomplete = "name";
    }

    if (field.name === "email") {
      hint.textContent = "Use a complete email address, like name@example.com.";
      field.autocomplete = "email";
    }

    if (field.name === "message") {
      hint.textContent = "Describe your issue or question in at least 15 characters.";
      field.minLength = 15;
    }

    field.insertAdjacentElement("afterend", hint);

    // Update validation feedback immediately while typing.
    field.addEventListener("input", function () {
      assignment12ValidateField(field);
    });

    // Also check the field when the user leaves it.
    field.addEventListener("blur", function () {
      assignment12ValidateField(field);
    });
  });

  submitStatus.setAttribute("role", "status");
  submitStatus.setAttribute("aria-live", "polite");
  // Handle Support submissions before the older form listeners run.
  // Other forms, including product search, keep their existing behavior.
  document.addEventListener("submit", function (event) {
    if (event.target !== assignment12Form) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (assignment12Submitting || supportView.hidden) return;

    let firstInvalidField = null;

    fields.forEach(function (field) {
      if (!assignment12ValidateField(field) && firstInvalidField === null) {
        firstInvalidField = field;
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    assignment12Submitting = true;
    assignment12Form.setAttribute("aria-busy", "true");

    assignment11SetButtonLoading(submitButton, "Submitting...");
    submitStatus.textContent = "Submitting your support request...";
    submitStatus.hidden = false;

    // Keep the validated information unchanged during simulated submission.
    fields.forEach(function (field) {
      field.readOnly = true;
    });
    setTimeout(function () {
      supportView.hidden = true;
      successView.hidden = false;
      submitStatus.hidden = true;

      assignment12Form.setAttribute("aria-busy", "false");
      assignment11ResetButton(submitButton);
      assignment12Submitting = false;

      fields.forEach(function (field) {
        field.readOnly = false;
      });

      const heading = successView.querySelector("h1");
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    }, 850);
  }, true);
}

// Clear navigation loading states when returning with Back or Forward.
window.addEventListener("pageshow", function () {
  closeMenu();
  closeFilters();
  document.querySelectorAll(".page-loading-overlay").forEach(function (overlay) {
    overlay.remove();
  });

  document.querySelectorAll('[data-assignment11-loading="true"]').forEach(function (button) {
    assignment11ResetButton(button);
  });
});

// Checkout popup
(function () {
  const popup = document.querySelector("#checkout");
  let busy = false;

  // Open checkout from the cart link on any page.
  window.addEventListener("click", function (event) {
    if (!event.target.closest(".cart-link")) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (popup) {
      openCheckout();
    } else {
      window.location.href = "product.html#checkout";
    }
  }, true);

  if (!popup) return;

  const content = document.querySelector("#checkout-content");
  const closeButton = document.querySelector("#close-checkout");

  const names = [
    "name", "email", "address", "city", "state",
    "zip", "cardname", "card", "expiry", "cvv"
  ];

  const labels = [
    "Full name", "Email address", "Street address", "City",
    "State", "ZIP code", "Name on card", "Card number",
    "Expiration date", "Security code"
  ];

  const hints = [
    "Taylor Davis", "taylor@example.com", "123 Example Street",
    "Charlotte", "NC", "28202", "Taylor Davis",
    "4242 4242 4242 4242", "MM/YY", "123"
  ];

  const autocomplete = [
    "name", "email", "street-address", "address-level2",
    "address-level1", "postal-code", "off", "off", "off", "off"
  ];

  function readCart() {
    const number = Number(sessionStorage.getItem("cartCount"));
    if (Number.isSafeInteger(number) && number > 0) return number;
    return 0;
  }

  function saveCart(number) {
    cartCount = number;
    sessionStorage.setItem("cartCount", number);
    updateCartCount();
  }

  function money(quantity) {
    return (quantity * 49999 / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
  }

  closeButton.addEventListener("click", function () {
    if (!busy) popup.close();
  });

  popup.addEventListener("cancel", function (event) {
    if (busy) event.preventDefault();
  });

  function createFields(start, end) {
    let html = "";

    for (let i = start; i < end; i++) {
      const type = names[i] === "email" ? "email" : "text";

      html += `
        <div class="co-field">
          <label for="co-${names[i]}">${labels[i]} *</label>
          <input
            id="co-${names[i]}"
            name="${names[i]}"
            type="${type}"
            placeholder="${hints[i]}"
            autocomplete="${autocomplete[i]}"
            aria-describedby="error-${names[i]}"
            required>
          <p id="error-${names[i]}"
             class="co-error" aria-live="polite" hidden></p>
        </div>`;
    }

    return html;
  }

  function validate(input) {
    const value = input.value.trim();
    const name = input.name;
    let error = "";

    if (!value) {
      error = "This field is required.";
    } else if (
      name === "name" &&
      !/^[\p{L}\p{M} ]+$/u.test(value)
    ) {
      error = "Use letters and spaces only.";
    } else if (
      (name === "name" || name === "cardname" || name === "city") &&
      value.length < 2
    ) {
      error = "Enter at least 2 characters.";
    } else if (
      name === "email" &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ||
        input.validity.typeMismatch)
    ) {
      error = "Enter a valid email, like name@example.com.";
    } else if (name === "address" && value.length < 5) {
      error = "Enter your complete street address.";
    } else if (name === "state") {
      const states = (
        "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA " +
        "ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR " +
        "PA RI SC SD TN TX UT VT VA WA WV WI WY"
      ).split(" ");

      if (!states.includes(value.toUpperCase())) {
        error = "Enter a valid state abbreviation, like NC.";
      }
    } else if (name === "zip" && !/^\d{5}(-\d{4})?$/.test(value)) {
      error = "Enter a valid ZIP code, like 28202.";
    } else if (
      name === "card" &&
      !/^\d{13,19}$/.test(value.replace(/\s/g, ""))
    ) {
      error = "Enter a card number containing 13–19 digits.";
    } else if (name === "cvv" && !/^\d{3,4}$/.test(value)) {
      error = "Enter a 3- or 4-digit security code.";
    } else if (name === "expiry") {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        error = "Use MM/YY, like 12/30.";
      } else {
        const month = Number(value.slice(0, 2));
        const year = 2000 + Number(value.slice(3));

        if (new Date(year, month, 1) <= new Date()) {
          error = "Enter a current or future expiration date.";
        }
      }
    }

    const feedback = document.querySelector("#error-" + name);
    feedback.textContent = error;
    feedback.hidden = error === "";
    input.setAttribute("aria-invalid", error ? "true" : "false");

    return error === "";
  }

  function openCheckout() {
    if (busy || popup.open) return;

    const quantity = readCart();

    if (!quantity) {
      content.innerHTML = `
        <div class="co-success">
          <h2 id="checkout-title">Your cart is empty</h2>
          <p>Add a product to begin checkout.</p>
        </div>`;
      popup.showModal();
      return;
    }

    content.innerHTML = `
      <h2 id="checkout-title">Checkout</h2>

      <form id="co-form" novalidate>
        <h3 class="co-heading">Contact & shipping</h3>
        <p class="co-hint">All fields are required. US shipping only.</p>
        <div class="co-grid">${createFields(0, 6)}</div>

        <h3 class="co-heading">Payment details</h3>
        
        <div class="co-grid">${createFields(6, 10)}</div>

        <section class="co-summary" aria-label="Order summary">
          <h3>Your order</h3>

          <div class="co-item">
            <img id="co-image" src="./assets/MSIKatana.png"
                 alt="MSI Katana 15 Gaming Laptop">

            <div class="co-product">
              <strong>MSI Katana 15 Gaming Laptop</strong>
              <p>$499.99 each · Free shipping</p>
              <p>Tax not applied in demo</p>
            </div>

            <div class="co-field co-quantity">
              <label for="co-quantity">Quantity</label>
              <input id="co-quantity" type="number"
                min="1" max="999" step="1" value="${quantity}"
                aria-describedby="co-quantity-error" required>
            </div>
          </div>

 <p id="co-quantity-error"
             class="co-error" aria-live="polite" hidden></p>

          <div class="co-total" aria-live="polite">
            <span>Order total</span>
            <strong id="co-total"></strong>
          </div>
        </section>

        <button id="co-submit" class="co-button" type="submit">
          Place order →
        </button>

        <button id="co-continue" class="co-continue" type="button">
          Continue shopping
        </button>
      </form>`;
    const form = document.querySelector("#co-form");
    const inputs = form.querySelectorAll(".co-grid input");
    const quantityInput = document.querySelector("#co-quantity");
    const submit = document.querySelector("#co-submit");
    const continueButton = document.querySelector("#co-continue");

    const image = document.querySelector("#co-image");

    image.addEventListener("error", function () {
      image.hidden = true;
    });

    continueButton.addEventListener("click", function () {
      if (!busy) popup.close();
    });

    function updateTotal(save) {
      const number = Number(quantityInput.value);
      const valid = quantityInput.validity.valid &&
        Number.isInteger(number) && number >= 1 && number <= 999;

      const error = document.querySelector("#co-quantity-error");
      error.textContent = "Enter a whole number from 1 to 999.";
      error.hidden = valid;

      quantityInput.setAttribute("aria-invalid", valid ? "false" : "true");

      document.querySelector("#co-total").textContent =
        valid ? money(number) : "—";

      if (valid && save) saveCart(number);
      return valid;
    }

    quantityInput.addEventListener("input", function () {
      updateTotal(true);
    });

    updateTotal(false);

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("blur", function () {
        this.dataset.touched = "true";
        validate(this);
      });

      inputs[i].addEventListener("input", function () {
        if (this.dataset.touched === "true") validate(this);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (busy) return;

      let firstInvalid = null;

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].dataset.touched = "true";

        if (!validate(inputs[i]) && !firstInvalid) {
          firstInvalid = inputs[i];
        }
      }

      if (!updateTotal(false) && !firstInvalid) {
        firstInvalid = quantityInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      busy = true;
      const ordered = Number(quantityInput.value);

      submit.disabled = true;
      closeButton.disabled = true;
      continueButton.disabled = true;
      quantityInput.disabled = true;

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }

      form.setAttribute("aria-busy", "true");
      submit.textContent = "Placing order…";

      setTimeout(function () {
        saveCart(0);

        content.innerHTML = `
          <div class="co-success">
            <div class="success-mark" aria-hidden="true">
  <i class="fa-solid fa-check"></i>
</div>
            <h2 id="checkout-title" tabindex="-1">Order confirmed</h2>
            <p>${ordered} × MSI Katana 15 Gaming Laptop</p>

            <p class="co-success-total">
              Total: <strong>${money(ordered)}</strong>
            </p>
            

            <a href="index.html" class="co-button">Return to home →</a>
          </div>`;

        busy = false;
        closeButton.disabled = false;
        document.querySelector("#checkout-title").focus();
      }, 700);
    });

    popup.showModal();
  }

  if (location.hash === "#checkout") openCheckout();

  window.addEventListener("hashchange", function () {
    if (location.hash === "#checkout") openCheckout();
  });
})();
// Assignment 13: keyboard access and clearer control feedback.

// Keep each suggestion list usable with arrows, Enter, Escape, and a trackpad.
document.querySelectorAll("[data-search-form] input[name='query']").forEach(function (input) {
  const box = input.closest(".search-input-wrap").querySelector(".live-suggestions");
  if (!box) return;

  box.id = input.id + "-suggestions";
  box.setAttribute("aria-label", "Product suggestions");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-haspopup", "listbox");
  input.setAttribute("aria-controls", box.id);
  input.setAttribute("aria-expanded", "false");
  input.autocomplete = "off";

  function updateSuggestions() {
    input.removeAttribute("aria-activedescendant");
    box.querySelectorAll(".live-suggestion").forEach(function (button, index) {
      button.id = box.id + "-" + index;
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");
      button.tabIndex = -1;
    });
    const empty = box.querySelector(".live-suggestion-empty");
    if (empty) {
      empty.setAttribute("role", "option");
      empty.setAttribute("aria-disabled", "true");
    }
    input.setAttribute("aria-expanded", String(!box.hidden));
  }

  input.addEventListener("input", updateSuggestions);
  input.addEventListener("focus", updateSuggestions);

  input.addEventListener("keydown", function (event) {
    const options = Array.from(box.querySelectorAll(".live-suggestion"));
    let selected = options.findIndex(function (option) {
      return option.getAttribute("aria-selected") === "true";
    });

    if (event.key === "Escape") {
      box.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!options.length) return;
      event.preventDefault();
      box.hidden = false;
      selected = event.key === "ArrowDown"
        ? (selected + 1) % options.length
        : (selected <= 0 ? options.length : selected) - 1;

      options.forEach(function (option, index) {
        option.setAttribute("aria-selected", String(index === selected));
      });
      input.setAttribute("aria-expanded", "true");
      input.setAttribute("aria-activedescendant", options[selected].id);
      options[selected].scrollIntoView({ block: "nearest" });
    }

    if (event.key === "Enter" && !box.hidden && selected >= 0) {
      event.preventDefault();
      options[selected].click();
    }

    if (event.key === "Tab") {
      box.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
  });

  box.addEventListener("click", function () {
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  });
  input.addEventListener("blur", function () {
    input.setAttribute("aria-expanded", "false");
  });
});
// Decorative icons do not need to be read aloud.
document.querySelectorAll("i.fa-solid, i.fa-regular").forEach(function (icon) {
  icon.setAttribute("aria-hidden", "true");
});

// Distinguish repeated product actions and announce ratings clearly.
document.querySelectorAll(".product-card").forEach(function (card) {
  const title = card.querySelector("h3").textContent.trim();
  const compare = card.querySelector("[data-compare]");
  const link = card.querySelector(".product-card__actions a");
  if (compare) compare.setAttribute("aria-label", "Compare " + title);
  if (link) link.setAttribute("aria-label", "View product: " + title);
});

document.querySelectorAll(".rating").forEach(function (rating) {
  if (!rating.hasAttribute("aria-label")) {
    const stars = (rating.textContent.match(/★/g) || []).length;
    const reviews = rating.querySelector("span");
    rating.setAttribute("aria-label", stars + " out of 5 stars" +
      (reviews ? ", " + reviews.textContent.trim() + " reviews" : ""));
  }
  rating.setAttribute("role", "img");
});

document.querySelectorAll(".gallery-thumb").forEach(function (button, index) {
  button.setAttribute("aria-label", "Show product image " + (index + 1));
  button.setAttribute("aria-pressed",
    String(button.classList.contains("is-selected")));
});

document.querySelectorAll(".results-meta, .compare-message, .cart-feedback").forEach(function (message) {
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
});

// The skip link moves keyboard focus straight to the main content.
const mainContent = document.querySelector("main");
if (mainContent) mainContent.tabIndex = -1;
// Keep keyboard focus inside an open mobile drawer.
document.addEventListener("keydown", function (event) {
  const activeMenu = menu && menu.classList.contains("is-open");
  const activeFilters = filterDrawer && filterDrawer.classList.contains("is-open");
  if (!activeMenu && !activeFilters) return;

  if (event.key === "Escape") {
    if (activeFilters) closeFilters();
    return;
  }
  if (event.key !== "Tab") return;

  const panel = activeMenu ? menu : filterDrawer;
  const controls = Array.from(panel.querySelectorAll("a[href], button, input, select"))
    .filter(function (control) {
      return control.getClientRects().length && !control.disabled;
    });
  if (activeMenu) controls.unshift(menuButton);
  if (!controls.length) return;

  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    closeMenu();
    closeFilters();
  }
});


// Automatically format the expiration date as MM/YY.
document.addEventListener("input", function (event) {
  if (event.target.id !== "co-expiry") return;

  const input = event.target;
  const digits = input.value.replace(/\D/g, "").slice(0, 4);
  const deleting = event.inputType?.startsWith("delete");

  if (digits.length > 2 || (digits.length === 2 && !deleting)) {
    input.value = digits.slice(0, 2) + "/" + digits.slice(2);
  } else {
    input.value = digits;
  }
}, true);

// Homepage promotional carousel.
(function () {
  const carousel = document.querySelector("[data-promo-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector(".promo-track");
  const slides = carousel.querySelectorAll(".promo-slide");
  const dots = carousel.querySelectorAll("[data-promo-dot]");
  const previous = carousel.querySelector("[data-promo-prev]");
  const next = carousel.querySelector("[data-promo-next]");
  const pauseButton = carousel.querySelector("[data-promo-pause]");
  const status = carousel.querySelector("[data-promo-status]");
  const viewport = carousel.querySelector(".promo-viewport");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentSlide = 0;
  let timer = null;
  let hovering = false;
  let paused = reducedMotion.matches;
  let touchStart = null;
  // Duplicate the first slide for a seamless forward loop.
const firstSlideCopy = slides[0].cloneNode(true);
firstSlideCopy.inert = true;
firstSlideCopy.setAttribute("aria-hidden", "true");
track.appendChild(firstSlideCopy);
let wrapping = false;


// Fit the mobile carousel to the active slide.
function fitMobileSlide() {
  if (window.innerWidth < 768) {
    viewport.style.height = slides[currentSlide].offsetHeight + "px";
  } else {
    viewport.style.height = "";
  }
}

// Update the height when the browser size changes.
window.addEventListener("resize", fitMobileSlide);

// Update again after banner images finish loading.
carousel.querySelectorAll("img").forEach(function (image) {
  image.addEventListener("load", fitMobileSlide);
});

// Update after the website fonts finish loading.
if (document.fonts) {
  document.fonts.ready.then(fitMobileSlide);
}

  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }

  function updatePauseButton() {
    pauseButton.setAttribute(
      "aria-label",
      paused ? "Start automatic promotions" : "Pause automatic promotions"
    );

    pauseButton.innerHTML = paused
      ? '<i class="fa-solid fa-play" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
  }

  function startTimer() {
    stopTimer();

    if (
      paused ||
      hovering ||
      document.hidden ||
      slides[currentSlide].contains(document.activeElement)
    ) {
      return;
    }

    timer = setTimeout(function () {
      showSlide(currentSlide + 1, false);
      startTimer();
    }, 5000);
  }

  function showSlide(index, announce) {
  if (wrapping) return;

  const movingPastEnd = index >= slides.length;
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach(function (slide, slideIndex) {
    const active = slideIndex === currentSlide;
    slide.inert = !active;
    slide.setAttribute("aria-hidden", String(!active));
  });

  dots.forEach(function (dot, dotIndex) {
    dot.setAttribute(
      "aria-pressed",
      String(dotIndex === currentSlide)
    );
  });

  if (announce) {
    status.textContent =
      slides[currentSlide].getAttribute("aria-label");
  }

  fitMobileSlide();

  if (movingPastEnd && !reducedMotion.matches) {
    wrapping = true;

    // Continue forward to the duplicate first slide.
    track.style.transform =
      "translateX(-" + slides.length * 100 + "%)";

    function finishLoop(event) {
      if (
        event &&
        (event.target !== track || event.propertyName !== "transform")
      ) {
        return;
      }

      clearTimeout(fallback);
      track.removeEventListener("transitionend", finishLoop);

      // Jump to the identical real first slide without animation.
      track.style.transition = "none";
      track.style.transform = "translateX(0)";

      // Apply the reset before restoring the CSS transition.
      void track.offsetWidth;
      track.style.transition = "";

      wrapping = false;
    }

    track.addEventListener("transitionend", finishLoop);
    const fallback = setTimeout(finishLoop, 650);
  } else {
    track.style.transform =
      "translateX(-" + currentSlide * 100 + "%)";
  }
}

  function navigate(index) {
    showSlide(index, true);
    startTimer();
  }

  previous.addEventListener("click", function () {
    navigate(currentSlide - 1);
  });

  next.addEventListener("click", function () {
    navigate(currentSlide + 1);
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      navigate(Number(dot.dataset.promoDot));
    });
  });

  pauseButton.addEventListener("click", function () {
    paused = !paused;
    updatePauseButton();
    startTimer();
  });

  carousel.addEventListener("mouseenter", function () {
    hovering = true;
    stopTimer();
  });

  carousel.addEventListener("mouseleave", function () {
    hovering = false;
    startTimer();
  });

  // Stop rotation when someone navigates with the keyboard.
  // They can explicitly restart it using the play button.
  carousel.addEventListener("focusin", function (event) {
    stopTimer();

    if (event.target.matches(":focus-visible")) {
      paused = true;
      updatePauseButton();
    }
  });

  carousel.addEventListener("focusout", function () {
    setTimeout(startTimer, 0);
  });

  document.addEventListener("visibilitychange", startTimer);

  reducedMotion.addEventListener("change", function (event) {
    if (event.matches) {
      paused = true;
      updatePauseButton();
      stopTimer();
    }
  });

  viewport.addEventListener("touchstart", function (event) {
    stopTimer();

    if (event.touches.length !== 1) {
      touchStart = null;
      return;
    }

    touchStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }, { passive: true });

  viewport.addEventListener("touchend", function (event) {
    if (touchStart && event.changedTouches.length) {
      const distanceX =
        event.changedTouches[0].clientX - touchStart.x;
      const distanceY =
        event.changedTouches[0].clientY - touchStart.y;

      if (
        Math.abs(distanceX) > 50 &&
        Math.abs(distanceX) > Math.abs(distanceY)
      ) {
        const direction = distanceX < 0 ? 1 : -1;

        if (slides[currentSlide].contains(document.activeElement)) {
          (direction === 1 ? next : previous).focus({
            preventScroll: true
          });
        }

        navigate(currentSlide + direction);
      }
    }

    touchStart = null;
    startTimer();
  }, { passive: true });

  viewport.addEventListener("touchcancel", function () {
    touchStart = null;
    startTimer();
  }, { passive: true });

  updatePauseButton();
  startTimer();
})();

// Related product buttons are placeholders for this demo.
document.querySelectorAll("[data-related-demo]").forEach(function (button) {
  button.addEventListener("click", function () {
    showToast("Product details are not available in this demo.");
  });
});