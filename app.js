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
    overview: "From coursework to game time. The MSI Katana 15 brings everyday productivity and PC gaming together, giving you one laptop for assignments, entertainment, and supported creative projects ",

    benefits: [
      {
        title: "Play and create:",
        text: "Dedicated NVIDIA RTX 4060 laptop graphics power PC games and help accelerate supported creative applications, including video-editing tools."
      },
      {
        title: "Follow fast-moving action:",
        text: "The 15.6-inch Full HD display supports refresh rates up to 144Hz for smoother-looking movement when your game runs at higher frame rates."
      },
      {
        title: "Keep your projects and everyday apps together:",
        text: "An Intel Core i7 processor and 16GB of memory support multitasking, while a 1TB SSD provides storage for coursework, applications, and games."
      }
    ],

    specs: [
      [
        "15.6-inch Full HD IPS display, 144Hz",
        "Full HD keeps text and images clear. IPS helps colors stay consistent when viewed at an angle. The 144Hz refresh rate makes movement look smoother when your game can keep up."
      ],
      [
        "Intel Core i7-13620H processor",
        "The main chip that runs your software. It handles everyday work and more demanding tasks such as editing video or running several applications together."
      ],
      [
        "NVIDIA GeForce RTX 4060 Laptop GPU",
        "A separate graphics chip for games, 3D visuals, and supported creative software."
      ],
      [
        "16GB DDR5 RAM",
        "Your laptop’s temporary workspace. It lets you keep multiple apps and tabs open."
      ],
      [
        "1TB SSD",
        "Stores your games, apps and files, while helping the laptop start and load programs quickly."
      ]
    ],

    fullSpecs: [
      ["Product family", "MSI Katana 15"],
      ["Product type", "Gaming laptop"],
      ["Processor", "Intel Core i7-13620H"],
      ["Graphics", "NVIDIA GeForce RTX 4060 Laptop GPU"],
      ["Display size", "15.6 inches"],
      ["Display resolution", "Full HD, 1920 × 1080"],
      ["Refresh rate", "144Hz"],
      ["Installed memory", "16GB DDR5"],
      ["Storage", "1TB SSD"]
    ],



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

    overview: "The Elite Liquid 240 uses a liquid-cooling system, radiator, and fans to move heat away from your desktop processor, with customizable lighting to complement your build. ",
    benefits: [
      {
        title: "Move heat away from your CPU:",
        text: "Liquid carries heat from the processor to the radiator, where the fans release it into the surrounding air."
      },
      {
        title: "Match your setup's style.",
        text: "Adjust the lighting on the pump and fans using compatible lighting controls."
      },
      {
        title: "Check the fit before you buy.",
        text: "Addressable RGB on the pump and fans lets you customize appearance with compatible lighting connections or a controller."
      }
    ],

    specs: [
      [
        "240mm all-in-one CPU liquid cooler",
        "Carries heat away from your processor to help keep temperatures under control during gaming and demanding tasks."
      ],
      [
        "Two 120mm fans",
        "Push air through the radiator to release heat. Check that your case has room for both the radiator and its attached fans."
      ],
      [
        "Intel LGA 1851/1700 and AMD AM5/AM4 support",
        "Works across several Intel and AMD platforms, giving you more flexibility when building or upgrading your PC.."
      ],
      [
        "Pre-installed Intel/AMD mounting bracket",
        "Saves setup time by arriving with the mounting bracket already attached"
      ],
      [
        "Pre-applied CryoFuze thermal paste",
        "Comes with thermal paste already applied for the first installation, so you don’t need to apply it separately"
      ],

    ],

    fullSpecs: [
      ["Brand", "Cooler Master"],
      ["Product family", "Elite Liquid 240"],
      ["Product type", "All-in-one CPU liquid cooler"],
      ["Radiator size class", "240mm"],
      ["Included fans", "2 × 120mm"],
      ["Lighting", "Addressable RGB on pump and fans"],
      ["Intel socket support", "LGA 1851, LGA 1700"],
    ],


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
    overview: "For everyday work and light creative projects, this Zenbook 14 reference combines a detailed OLED screen with memory and storage for your apps and files.",

    benefits: [
      {
        title: "See the details that matter:",
        text: "The 2.8K OLED display makes text and images look sharp, with deep blacks and strong contrast for viewing photos and videos."
      },
      {
        title: "Keep your workflow moving.",
        text: "A Ryzen 7 processor and 16GB of memory let you move between documents, browser tabs, and supported creative apps."
      },
      {
        title: "Keep your files within reach.",
        text: "A 1TB SSD gives you space for applications, photos, and projects, with fast access when it’s time to get back to work."
      }
    ],

    specs: [
      [
        "14-inch 2.8K OLED touchscreen",
        "See sharp text, rich colors, and deep blacks, with touch controls for tapping and scrolling directly on the screen."
      ],
      [
        "AMD Ryzen 7 5825U processor",
        "Runs everyday applications and supports multitasking across work and creative tools."
      ],
      [
        "16GB LPDDR4X RAM",
        "Keep documents, browser tabs, and other apps open together without constantly closing one to use another."
      ],
      [
        "1TB SSD",
        "Store your projects, photos, and applications, with fast access to files and shorter loading times than a traditional hard drive."
      ],
      [
        "Integrated AMD Radeon graphics",
        "Supports streaming, everyday photo editing, and lighter games without a separate graphics card."
      ]
    ],

    fullSpecs: [
      ["Brand", "ASUS"],
      ["Product family", "Zenbook 14"],
      ["Product type", "Laptop"],
      ["Processor", "AMD Ryzen 7 5825U"],
      ["Graphics", "Integrated AMD Radeon graphics"],
      ["Display size", "14 inches"],
      ["Display technology", "OLED"],
      ["Display resolution", "2.8K"],
    ],



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
    overview: "Enjoy a large 32-inch OLED display that lets you switch between detailed 4K gaming and a faster Full HD mode for competitive play.",

    benefits: [
      {
        title: "See more detail in your games:",
        text: "4K resolution brings out fine details, while OLED’s deep blacks give dark scenes stronger contrast."
      },
      {
        title: "Match the screen to your game:",
        text: "Choose 4K at up to 240Hz for detailed visuals, or Full HD at up to 480Hz when smoother motion is your priority."
      },
      {
        title: "Connect your gaming setup:",
        text: "HDMI and DisplayPort give you options for connecting compatible computers and consoles."
      }
    ],

    specs: [
      [
        "32-inch-class 4K OLED screen",
        "See fine details across a large screen, with deep blacks that give movies and games stronger contrast."
      ],
      [
        "Dual mode: 4K/240Hz or Full HD/480Hz",
        "Choose sharper detail at 4K or faster screen updates at Full HD for fast-paced games. Actual smoothness depends on your computer and game settings."
      ],
      [
        "TrueBlack Glossy finish",
        "Gives images a glossy, vivid appearance, though bright lights and windows may create visible reflections."
      ],
      [
        "HDMI 2.1 and DisplayPort 1.4",
        "Connect compatible PCs and consoles. Available resolutions and refresh rates depend on the device and cable."
      ]
    ],


    fullSpecs: [
      ["Screen diagonal", "31.5 inches — 32-inch class"],
      ["Panel technology", "OLED"],
      ["Native resolution", "3840 × 2160"],
      ["Maximum 4K refresh rate", "240Hz"],
      ["Maximum Full HD refresh rate", "480Hz"],
      ["Screen finish", "TrueBlack Glossy"],
      ["HDMI input standard", "HDMI 2.1"],
      ["DisplayPort input standard", "DisplayPort 1.4"]
    ],



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
    overview: "Enjoy physical games and digital downloads on one console. The PlayStation 5 Slim Disc Edition combines fast loading, immersive controller feedback, and detailed visuals in a compact design.",

    benefits: [
      {
        title: "Play your collection, your way:",
        text: "Choose game discs or digital downloads, with support for PS5 titles and most PS4 games."
      },
      {
        title: "Spend less time waiting:",
        text: "High-speed SSD storage helps supported games load quickly, getting you back into the action sooner."
      },
      {
        title: "Feel more of the action:",
        text: "The DualSense controller adds detailed vibrations and changing trigger resistance in supported games, bringing sensations like rough terrain or drawing a bow into your hands."
      }
    ],


    specs: [
      [
        "Ultra HD Blu-ray disc drive",
        "Play PS5 discs and supported PS4 discs, giving you the option to buy, borrow, or collect physical games."
      ],
      [
        "1TB SSD",
        "Keep games installed and ready to launch, with fast loading in supported titles. Some storage is reserved for system software."
      ],
      [
        "DualSense wireless controller",
        "Feel details like impacts and changing trigger resistance, making supported games more immersive."
      ],
      [
        "4K and HDR support",
        "Enjoy sharp detail and a wider range of bright and dark tones in supported games on a compatible TV or monitor."
      ]
    ],


    fullSpecs: [
      ["Console edition", "PS5 Slim Disc — reference edition"],
      ["Nominal internal storage", "1TB SSD — reference configuration"],
      ["Optical disc format", "Ultra HD Blu-ray"],
      ["Supported video resolution", "Up to 4K in supported games and setups"],
      ["Included controller", "One DualSense wireless controller — reference package"]
    ],



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
    overview: "Keep your desktop processor cool while giving your build a coordinated look. The MSI MAG Coreliquid A13 360 Black pairs a large radiator with three adjustable-speed fans and customizable lighting.",

    benefits: [
      {
        title: "Cooling for demanding sessions.",
        text: "A 360mm radiator and three fans work together to carry heat away from your processor during gaming and other intensive tasks."
      },
      {
        title: "Adjusts as your workload changes.",
        text: "Compatible fan controls can increase airflow when your processor works harder and reduce fan speeds during lighter use."
      },
      {
        title: "Make the lighting your own.",
        text: "Customize the lighting with a compatible controller to match the colors and style of your setup."
      }
    ],

    specs: [
      [
        "360mm radiator",
        "Spreads heat across a large cooling surface to help manage processor temperatures during demanding tasks."
      ],
      [
        "Three 120mm PWM fans",
        "Adjustable fan speeds provide more airflow during heavy workloads and can reduce noise during lighter use."
      ],
      [
        "Intel LGA 1700/1851 and AMD AM4/AM5 support",
        "Fits several Intel and AMD processor platforms, giving you flexibility when building or upgrading your desktop."
      ],
      [
        "5V 3-pin ARGB lighting",
        "Customize lighting colors and effects to coordinate with the rest of your setup using compatible lighting controls."
      ]
    ],


    fullSpecs: [
      ["Model number", "CLA13360"],
      ["Color", "Black"],
      ["Radiator dimensions", "Approximately 394 × 119.6 × 27mm"],
      ["Tubing length", "390mm"],
      ["Cold plate material", "Copper"]
    ],



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

    overview: "Put your favorite controls at your fingertips. The Logitech G502 HERO combines customizable buttons, adjustable weight, and versatile scrolling for gaming and everyday work.",

    benefits: [
      {
        title: "Reach your shortcuts faster.",
        text: "Assign frequently used actions to 11 programmable buttons, keeping game commands and everyday shortcuts close at hand."
      },
      {
        title: "Make it feel right for you.",
        text: "Adjust pointer sensitivity and add or remove the included weights to find a balance that suits your hand and movements."
      },
      {
        title: "Scroll your way.",
        text: "Switch between precise, stepped scrolling for individual selections and free-spinning scrolling to move quickly through long documents and webpages."
      }
    ],

    specs: [
      [
        "USB wired connection",
        "Plug in and play without worrying about battery life or recharging."
      ],
      [
        "HERO 25K sensor, 100–25,600 DPI",
        "Choose how far the pointer moves when you move your hand, from slower, controlled movements to faster navigation."
      ],
      [
        "11 programmable buttons",
        "Keep game commands and everyday shortcuts within easy reach by assigning them through Logitech G HUB."
      ],
      [
        "Five removable 3.6g weights",
        "Make the mouse lighter or heavier and adjust its balance to suit your preferred feel."
      ]
    ],


    fullSpecs: [
      ["Model", "G502 HERO"],
      ["Connection", "USB wired"],
      ["Sensor", "HERO 25K optical"],
      ["Sensitivity range", "100–25,600 DPI"],
      ["Programmable buttons", "11"]
    ],



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
    overview: "Stay connected to your game and your teammates without a headset cable getting in the way. The Razer BlackShark V2 HyperSpeed combines wireless audio, an adjustable boom microphone, and long battery life for gaming and everyday listening.",

    benefits: [
      {
        title: "Play without the cable.",
        text: "A wireless USB receiver connects the headset to compatible devices, giving you freedom to move without a cable running to your computer."
      },
      {
        title: "Keep your team in the conversation.",
        text: "Position the bendable microphone close to your mouth for voice chat, calls, and coordinating your next move."
      },
      {
        title: "Recharge less often.",
        text: "Long battery life lets you get through multiple gaming sessions between charges. Actual runtime depends on volume and usage."
      }
    ],


    specs: [
      [
        "2.4GHz wireless, Bluetooth and USB wired audio",
        "Use the wireless receiver for gaming, Bluetooth for compatible mobile devices, or a USB cable for wired listening."
      ],
      [
        "Up to 70 hours of battery life",
        "Get through multiple gaming sessions between charges. Actual battery life varies with volume and usage."
      ],
      [
        "Bendable boom microphone",
        "Position the microphone close to your mouth so teammates can hear you more clearly."
      ],
      [
        "Memory-foam ear cushions",
        "Soft padding cushions your ears during longer sessions and helps reduce surrounding sound through a close fit."
      ]
    ],


    fullSpecs: [
      ["Wireless connection", "2.4GHz through a wireless dongle"],
      ["Bluetooth version", "5.2"],
      ["Wired connection", "USB"],
      ["Driver diameter", "50mm"],
      ["Listed weight", "280g — researched White Edition"]
    ],


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
    overview: "Jump into military action with a digital copy of Call of Duty. Download the game without a physical disc and explore the content included in the Standard edition.",

    benefits: [
      {
        title: "No disc required.",
        text: "Redeem your code and download the game directly to a supported device."
      },
      {
        title: "Start with the base game.",
        text: "The Standard edition includes the main game without the additional content offered in premium editions."
      },
      {
        title: "Keep it in your digital library.",
        text: "Access your purchase through the account used to redeem it, without storing or swapping a physical disc."
      }
    ],


    specs: [
      [
        "Digital download code",
        "Download the game without waiting for shipping or keeping track of a physical disc."
      ],
      [
        "Standard edition",
        "Get the base game without paying for a premium edition's additional content."
      ],
      [
        "Account-linked redemption",
        "Keep the game in the digital library of the account used to redeem your code."
      ]
    ],


    fullSpecs: [
      ["Model number", "G7Q-00461"],
      ["Edition", "Standard"],
      ["Delivery format", "Digital download code"],
      ["Console platform", "Xbox Series X|S"],
      ["PC platform", "Windows 10/11"]
    ],


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
    overview: "For PC gaming and everyday work, this Lenovo LOQ reference combines dedicated graphics, a high-refresh screen and storage for applications, projects and games.",

    benefits: [
      {
        title: "Go from assignments to game time.",
        text: "A Ryzen 7 processor handles everyday work, while dedicated NVIDIA graphics power PC games and supported creative apps."
      },
      {
        title: "Follow fast-moving action.",
        text: "The 144Hz Full HD screen makes movement look smoother in games running at higher frame rates."
      },
      {
        title: "Make room for work and play.",
        text: "A 1TB SSD gives you space for projects, applications, and games, with quick access when you're ready to get started."
      }
    ],


    specs: [
      [
        "15.6-inch Full HD display, 144Hz",
        "See clear text and images, with smoother motion in games running at higher frame rates."
      ],
      [
        "AMD Ryzen 7 170 processor",
        "Run your everyday apps and move between assignments, browsing, and other tasks."
      ],
      [
        "NVIDIA GeForce RTX 4050 Laptop GPU",
        "Play PC games and accelerate graphics-intensive tasks in supported creative apps."
      ],
      [
        "1TB SSD",
        "Keep projects, applications, and games in one place, with faster loading than a traditional hard drive."
      ]
    ],


    fullSpecs: [
      ["Processor", "AMD Ryzen 7 170"],
      ["Graphics", "NVIDIA GeForce RTX 4050 Laptop GPU"],
      ["Display diagonal", "15.6 inches"],
      ["Display resolution", "1920 × 1080"],
      ["Display refresh rate", "144Hz"]
    ],


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
    overview: "Go from gaming to everyday calls without the wires. The Logitech G325 combines flexible wireless connections, a built-in microphone, and lightweight cushioning for work and play.",

    benefits: [
      {
        title: "Connect to your gaming setup or phone.",
        text: "Use the LIGHTSPEED receiver with your computer or Bluetooth with compatible devices, giving you options for gaming, music, and calls."
      },
      {
        title: "Speak without adjusting a microphone arm.",
        text: "The built-in microphone keeps voice chat and calls simple, with no boom to position in front of your face."
      },
      {
        title: "Keep things light.",
        text: "At 212g, the headset keeps weight down, while memory-foam earcups provide soft cushioning around your ears."
      }
    ],


    specs: [
      [
        "LIGHTSPEED wireless and Bluetooth",
        "Connect through the wireless receiver for gaming or use Bluetooth for listening and calls on compatible devices."
      ],
      [
        "Built-in beamforming microphone",
        "Talk to teammates or join calls without a microphone arm in front of your face."
      ],
      [
        "24+ hours of battery life",
        "Get through multiple sessions between charges. Actual runtime depends on volume, connection mode, and usage."
      ],
      [
        "212g headset weight",
        "Keeps the headset light on your head during gaming, listening, and calls."
      ]
    ],


    fullSpecs: [
      ["Receiver-based wireless technology", "Logitech LIGHTSPEED"],
      ["Bluetooth connection", "Supported"],
      ["Microphone design", "Built-in, boomless beamforming"],
      ["Battery life claim", "24+ hours — stated by Logitech"],
      ["Weight", "212g"]
    ],


    keySpecsNote: "",


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
    overview: "Settle into your daily work with room to multitask. The Acer Aspire Go 15 pairs a spacious screen with plenty of memory and storage for assignments, documents, and entertainment.",

    benefits: [
      {
        title: "Pick up where you left off.",
        text: "Keep research tabs, documents, and other apps open together. A Ryzen 7 processor and 32GB of memory give you room to move between tasks without constantly closing things."
      },
      {
        title: "See your work more comfortably.",
        text: "The 15.6-inch Full HD screen gives documents and spreadsheets room to breathe, while IPS technology keeps the picture consistent when viewed from an angle."
      },
      {
        title: "Make space for more than assignments.",
        text: "A 1TB SSD holds your applications, projects, photos, and videos, with fast access when you need to open a file or get started on something new."
      }
    ],


    specs: [
  [
    "15.6-inch Full HD IPS display",
    "Read clear text and watch detailed video on a spacious screen, with colors that stay consistent when viewed from an angle."
  ],
  [
    "AMD Ryzen 7 7730U processor",
    "Work on documents, join video calls, and switch between everyday apps."
  ],
  [
    "32GB DDR4 RAM",
    "Keep research tabs, large documents, and multiple apps open without constantly closing things to free up memory."
  ],
  [
    "1TB SSD",
    "Store your projects, photos, and applications, with faster startup and loading than a traditional hard drive."
  ]
],


    fullSpecs: [
      ["Processor", "AMD Ryzen 7 7730U"],
      ["Graphics", "Integrated AMD Radeon"],
      ["Memory", "32GB DDR4"],
      ["Storage", "1TB SSD"],
      ["Display resolution", "1920 × 1080"]
    ],


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
function makeSpecsTable(rows, caption, firstHeading, secondHeading) {
  firstHeading = firstHeading || "Technical feature";
  secondHeading = secondHeading || "What it means for you";

  let body = rows.map(function (row) {
    return '<tr>' +
      '<th scope="row">' + escapeProductText(row[0]) + '</th>' +
      '<td>' + escapeProductText(row[1]) + '</td>' +
      '</tr>';
  }).join("");

  if (rows.length === 0) {
    body = '<tr><td colspan="2">' +
      'Verified full specifications are not available ' +
      'for the exact catalog item yet.' +
      '</td></tr>';
  }

  return '<table class="product-spec-table">' +
    '<caption class="sr-only">' +
    escapeProductText(caption) +
    '</caption>' +
    '<thead><tr>' +
    '<th scope="col">' + escapeProductText(firstHeading) + '</th>' +
    '<th scope="col">' + escapeProductText(secondHeading) + '</th>' +
    '</tr></thead>' +
    '<tbody>' + body + '</tbody></table>';
}

// Build an introduction followed by practical benefits.
function renderProductOverview(product) {
  const panel = document.querySelector("#panel-overview");
  const benefits = product.benefits || [];

  panel.innerHTML = '<div class="product-overview-copy">' +
    '<p data-product-overview>' +
    escapeProductText(product.overview) +
    '</p>' +
    '<ul>' + benefits.map(function (benefit) {
      return '<li><strong>' +
        escapeProductText(benefit.title) +
        '</strong> ' +
        escapeProductText(benefit.text) +
        '</li>';
    }).join("") + '</ul></div>';
}

// Show a specification note only when one is provided.
function specsPanelNote(text) {
  if (!text) return "";

  return '<p class="specs-panel-note">' +
    escapeProductText(text) +
    '</p>';
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
      "";

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

    renderProductOverview(product);

    document.querySelector("#panel-key-specs").innerHTML =
      specsPanelNote(product.keySpecsNote) +
      makeSpecsTable(product.specs, product.title + " key specifications");

    document.querySelector("#panel-full-specs").innerHTML =
      specsPanelNote(product.fullSpecsNote) +
      makeSpecsTable(
        product.fullSpecs,
        product.title + " full specifications",
        "Specification",
        "Details"
      );

    const note = document.createElement("p");
    note.className = "product-spec-note";
    note.textContent = product.note;
    note.hidden = !product.note;
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