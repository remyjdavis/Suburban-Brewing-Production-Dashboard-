const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

console.log("DASHBOARD JS LOADED", Date.now());

document.addEventListener("DOMContentLoaded", () => {
  const fermenters = document.getElementById("fermenters");
  const brites = document.getElementById("brites");

  if (!fermenters || !brites) {
    console.error("❌ Missing dashboard containers");
    return;
  }

  loadTanks(fermenters, brites);
});

/*************************************************
 * LOAD TANKS (SAFE)
 *************************************************/
function loadTanks(fermenters, brites) {
  fetch(`${API}?action=tanks&_=${Date.now()}`)
    .then(res => res.json())
    .then(data => {
      console.log("🧪 RAW TANK API RESPONSE:", data);

      // 🚨 HARD STOP IF API IS WRONG
      if (!Array.isArray(data)) {
        console.error("❌ Tanks API did NOT return an array");
        console.error("Returned value:", data);

        fermenters.innerHTML =
          `<div style="color:red;font-weight:600;">
            Tanks failed to load.<br>
            Check Apps Script deployment.
          </div>`;
        return;
      }

      fermenters.innerHTML = "";
      brites.innerHTML = "";

      data.forEach(t => renderTankCard(t, fermenters, brites));
    })
    .catch(err => {
      console.error("❌ Dashboard load failed:", err);
    });
}

/*************************************************
 * RENDER TANK CARD
 *************************************************/
function renderTankCard(t, fermenters, brites) {
  const id = String(t.TankID || "").trim();
  const statusRaw = String(t.Status || "AVAILABLE").trim();
  const status = statusRaw.toUpperCase();

  const card = document.createElement("div");
  card.className = "dashboard-card";

  card.innerHTML = `
    <div class="tank-id">${id || "—"}</div>
    <div class="status ${status.replace(/\s+/g, "-")}">${statusRaw}</div>
    <div class="meta">
      <strong>Active Brew:</strong> ${t.ActiveBrewID || "—"}<br>
      <strong>Last Brew:</strong> ${t.LastBrewDate || "—"}
    </div>
  `;

  card.onclick = () => {
    const params = new URLSearchParams({
      tank: id,
      brewId: t.ActiveBrewID || ""
    });

    if (status.includes("FERMENT")) {
      window.location.href =
        "fermentation.html?" + params.toString();
    } else {
      window.location.href =
        "brew-log.html?" + params.toString();
    }
  };

  // ✅ SEMANTIC BUCKETING
  if (status.includes("FERMENT")) {
    fermenters.appendChild(card);
  } else {
    brites.appendChild(card);
  }
}
