const WHATSAPP_NUMBER = "26879336536";

const catalog = [
  {
    id: "screen-replacement",
    name: "Screen replacement",
    category: "repairs",
    price: 450,
    popular: true,
    description: "Cracked or blank screen replacement estimate. Final price depends on the exact phone model.",
    icon: "phone"
  },
  {
    id: "battery-replacement",
    name: "Battery replacement",
    category: "repairs",
    price: 250,
    popular: true,
    description: "Battery change for phones that drain quickly, switch off, or do not hold charge.",
    icon: "battery"
  },
  {
    id: "charging-port",
    name: "Charging port repair",
    category: "repairs",
    price: 150,
    popular: true,
    description: "Fix loose, damaged, or non-working charging ports after inspection.",
    icon: "plug"
  },
  {
    id: "speaker-mic",
    name: "Speaker or microphone repair",
    category: "repairs",
    price: 250,
    popular: false,
    description: "Repairs for low sound, no sound, muffled calls, or microphone issues.",
    icon: "sound"
  },
  {
    id: "software-service",
    name: "Software service",
    category: "repairs",
    price: 200,
    popular: false,
    description: "Phone setup, updates, basic troubleshooting, app cleanup, and performance checks.",
    icon: "settings"
  },
  {
    id: "screen-protector",
    name: "Tempered glass protector",
    category: "accessories",
    price: 80,
    popular: true,
    description: "Clear tempered glass protector fitted neatly for supported models.",
    icon: "shield"
  },
  {
    id: "phone-cover",
    name: "Phone cover",
    category: "accessories",
    price: 120,
    popular: true,
    description: "Protective covers available in selected sizes, colours, and finishes.",
    icon: "cover"
  },
  {
    id: "type-c-cable",
    name: "USB-C charging cable",
    category: "accessories",
    price: 100,
    popular: false,
    description: "Replacement USB-C cable for everyday charging and data transfer.",
    icon: "cable"
  },
  {
    id: "charger",
    name: "Fast charger",
    category: "accessories",
    price: 180,
    popular: true,
    description: "Wall charger for compatible Android and iPhone devices. Ask about available stock.",
    icon: "plug"
  },
  {
    id: "earphones",
    name: "Wired earphones",
    category: "accessories",
    price: 90,
    popular: false,
    description: "Simple wired earphones for music, calls, and everyday use.",
    icon: "sound"
  },
  {
    id: "power-bank",
    name: "Power bank",
    category: "accessories",
    price: 280,
    popular: false,
    description: "Portable battery pack options for charging while travelling or working.",
    icon: "battery"
  },
  {
    id: "diagnostics",
    name: "Phone diagnostics",
    category: "repairs",
    price: 100,
    popular: false,
    description: "Inspection to identify faults before repair. Diagnostic fee may apply.",
    icon: "settings"
  }
];

let activeFilter = "all";
let searchTerm = "";
const selected = new Map();

const grid = document.querySelector("#catalogGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const basketPanel = document.querySelector("#basketPanel");
const basketItems = document.querySelector("#basketItems");
const basketCount = document.querySelector("#basketCount");
const basketTotal = document.querySelector("#basketTotal");
const customerNote = document.querySelector("#customerNote");

const money = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0
});

function iconMarkup(type) {
  const icons = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M11 18h2"></path></svg>',
    battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="16" height="10" rx="2"></rect><path d="M21 11v2"></path><path d="M7 11h6"></path></svg>',
    plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M6 8h12v3a6 6 0 0 1-12 0z"></path></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4z"></path><path d="M16 9a5 5 0 0 1 0 6"></path><path d="M19 6a9 9 0 0 1 0 12"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 5h-4l-.4 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2.1 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 3h4l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    cover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="3"></rect><path d="M9 6h6"></path><path d="M9 18h6"></path></svg>',
    cable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7v4a5 5 0 0 0 10 0V7"></path><path d="M9 2v5"></path><path d="M15 2v5"></path><path d="M12 16v6"></path></svg>'
  };

  return icons[type] || icons.phone;
}

function getVisibleItems() {
  return catalog.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ||
      item.category === activeFilter ||
      (activeFilter === "popular" && item.popular);
    const searchable = `${item.name} ${item.description} ${item.category}`.toLowerCase();
    return matchesFilter && searchable.includes(searchTerm.toLowerCase());
  });
}

function renderCatalog() {
  const visibleItems = getVisibleItems();

  grid.innerHTML = visibleItems
    .map((item) => {
      const isAdded = selected.has(item.id);
      return `
        <article class="item-card">
          <div class="item-top">
            <span class="item-icon" aria-hidden="true">${iconMarkup(item.icon)}</span>
            ${item.popular ? '<span class="tag">Popular</span>' : ""}
          </div>
          <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <div class="item-bottom">
            <span class="price">${money.format(item.price)}</span>
            <button class="add-button ${isAdded ? "added" : ""}" type="button" data-id="${item.id}">
              ${isAdded ? "Added" : "Add"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  emptyState.style.display = visibleItems.length ? "none" : "block";
}

function renderBasket() {
  const items = [...selected.values()];
  const total = items.reduce((sum, item) => sum + item.price, 0);

  basketCount.textContent = String(items.length);
  basketTotal.textContent = money.format(total);
  basketItems.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="basket-row">
              <div>
                <strong>${item.name}</strong>
                <span>${item.category === "repairs" ? "Repair service" : "Accessory"}</span>
              </div>
              <strong>${money.format(item.price)}</strong>
              <button class="remove-button" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">x</button>
            </div>
          `
        )
        .join("")
    : '<p class="fine-print">No items selected yet. Add repairs or accessories from the price list.</p>';
}

function toggleItem(id) {
  const item = catalog.find((entry) => entry.id === id);
  if (!item) return;

  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.set(id, item);
  }

  renderCatalog();
  renderBasket();
}

function openBasket() {
  basketPanel.classList.add("open");
  basketPanel.setAttribute("aria-hidden", "false");
}

function closeBasket() {
  basketPanel.classList.remove("open");
  basketPanel.setAttribute("aria-hidden", "true");
}

function buildWhatsAppMessage() {
  const items = [...selected.values()];
  const lines = [
    "Hi Akwande Solutions, I am interested in the following:",
    ""
  ];

  if (items.length) {
    items.forEach((item) => {
      lines.push(`- ${item.name}: ${money.format(item.price)}`);
    });
    lines.push("");
    lines.push(`Estimated total: ${money.format(items.reduce((sum, item) => sum + item.price, 0))}`);
  } else {
    lines.push("- I would like help with a phone repair or cellphone accessory.");
  }

  const note = customerNote.value.trim();
  if (note) {
    lines.push("");
    lines.push(`Details: ${note}`);
  }

  lines.push("");
  lines.push("Please confirm availability, final price, and collection time.");
  return lines.join("\n");
}

function sendWhatsApp() {
  const message = encodeURIComponent(buildWhatsAppMessage());
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener,noreferrer");
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((entry) => entry.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderCatalog();
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (button) toggleItem(button.dataset.id);
});

basketItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (button) toggleItem(button.dataset.remove);
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderCatalog();
});

document.querySelector("#openBasket").addEventListener("click", openBasket);
document.querySelector("#closeBasket").addEventListener("click", closeBasket);
document.querySelector("#closeBasketBackdrop").addEventListener("click", closeBasket);
document.querySelector("#sendWhatsApp").addEventListener("click", sendWhatsApp);
document.querySelector("#quickWhatsApp").addEventListener("click", () => {
  if (!selected.size) openBasket();
  sendWhatsApp();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBasket();
});

renderCatalog();
renderBasket();
