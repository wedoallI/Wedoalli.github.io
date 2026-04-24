const button = document.getElementById("copyMessage");
const feedback = document.getElementById("copyFeedback");
const preview = document.getElementById("messagePreview");
const packagePrices = {
  "Standard - 10M": 10,
  "VIP - 20M": 20,
  "Insane - 30M": 30,
  "Auto XP Dispenser - 1M/2M": 1,
  "Diamond Armor - 2M": 2,
  "Regear - 2M": 2,
};
const filledItemPrices = {
  "Respawn Anchors - 7M": 7,
  "Glowstone - 1M": 1,
  "End Crystals - 4M": 4,
  "Obsidian - 1M": 1,
  "Bottles of Enchanting - 1M": 1,
  "Totems - 8M": 8,
  "Pearls - 500K": 0.5,
  "Golden Apples - 1.5M": 1.5,
};
const extrasPrices = {
  regear: 2,
  "diamond armor": 2,
  "auto xp dispenser": 1,
};
const fields = {
  packageName: document.getElementById("packageSelect"),
  filled: document.getElementById("filledSelect"),
  day: document.getElementById("dayInput"),
  time: document.getElementById("timeInput"),
  username: document.getElementById("nameInput"),
  extras: document.getElementById("extrasInput"),
};
const filledItemInputs = document.querySelectorAll('#filledItems input[type="checkbox"]');

function getFilledItems() {
  return Array.from(filledItemInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function formatMillions(value) {
  return Number.isInteger(value) ? `${value}M` : `${value}M`;
}

function getExtrasTotal(extras) {
  const extrasLower = extras.toLowerCase();
  let total = 0;

  Object.entries(extrasPrices).forEach(([name, price]) => {
    if (extrasLower.includes(name)) {
      total += price;
    }
  });

  return total;
}

function buildMessage() {
  const packageName = fields.packageName?.value || "Standard - 10M";
  const filled = fields.filled?.value || "None";
  const filledItems = getFilledItems();
  const day = fields.day?.value.trim() || "not set yet";
  const time = fields.time?.value.trim() || "not set yet";
  const username = fields.username?.value.trim() || "not set yet";
  const extras = fields.extras?.value.trim() || "none";
  const packageTotal = packagePrices[packageName] || 0;
  const filledTotal = filledItems.reduce((sum, item) => sum + (filledItemPrices[item] || 0), 0);
  const extrasTotal = extras === "none" ? 0 : getExtrasTotal(extras);
  const grandTotal = packageTotal + filledTotal + extrasTotal;

  return [
    "Hey, I want to schedule a Donut SMP order.",
    `Package: ${packageName}`,
    `Filled option: ${filled}`,
    `Filled items: ${filledItems.length ? filledItems.join(", ") : "none"}`,
    "Filled storage: 3 big chests",
    `Preferred day: ${day}`,
    `Preferred time: ${time}`,
    `IGN/Username: ${username}`,
    `Extras: ${extras}`,
    `Grand total: ${formatMillions(grandTotal)}`,
    "Discord contact: coolgamsmuh",
  ].join("\n");
}

function syncPreview() {
  if (preview) {
    preview.textContent = buildMessage();
  }
}

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", syncPreview);
  field?.addEventListener("change", syncPreview);
});

fields.filled?.addEventListener("change", () => {
  if (fields.filled?.value === "None") {
    filledItemInputs.forEach((input) => {
      input.checked = false;
    });
  }

  syncPreview();
});

filledItemInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (fields.filled) {
      fields.filled.value = input.checked || getFilledItems().length
        ? "Custom filled items selected"
        : "None";
    }

    syncPreview();
  });
});

syncPreview();

button?.addEventListener("click", async () => {
  const message = buildMessage();

  try {
    await navigator.clipboard.writeText(message);
    feedback.textContent = "DM copied. Paste it into Discord and send it to coolgamsmuh.";
  } catch {
    feedback.textContent = "Copy failed on this device. You can still copy the preview manually.";
  }
});
