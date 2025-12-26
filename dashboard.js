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

      if (!Array.isArray(data)) {
        fermenters.innerHTML =
          `<div style="color:red;font-weight:600;">
            Tanks failed to load.
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
    if (status.includes("FERMENT")) {
      openFermentationModal({
        tankId: id,
        brewId: t.ActiveBrewID || "",
        recipe: t.ActiveBrewID || ""
      });
    } else {
      const params = new URLSearchParams({
        tank: id,
        brewId: t.ActiveBrewID || ""
      });
      window.location.href =
        "brew-log.html?" + params.toString();
    }
  };

  if (status.includes("FERMENT")) {
    fermenters.appendChild(card);
  } else {
    brites.appendChild(card);
  }
}

/*************************************************
 * FERMENTATION MODAL
 *************************************************/
function openFermentationModal({ tankId, brewId, recipe }) {
  const modal = document.getElementById("fermModal");
  const title = document.getElementById("fermTitle");

  title.textContent = `Tank ${tankId} – Active Fermentation`;
  modal.classList.remove("hidden");

  loadFermentationData(tankId, brewId);
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("ferm-close")) {
    document.getElementById("fermModal").classList.add("hidden");
  }
});

/*************************************************
 * LOAD FERMENTATION DATA
 *************************************************/
function loadFermentationData(tankId, brewId) {
  fetch(`${API}?action=fermentation&tank=${tankId}&brewId=${brewId}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) return;

      renderFermentationCards(data);
      drawFermentationChart(data);
    });
}

function renderFermentationCards(data) {
  const container = document.getElementById("fermCards");
  container.innerHTML = "";

  data.slice().reverse().forEach(d => {
    const card = document.createElement("div");
    card.className = "ferm-card";

    card.innerHTML = `
      <div class="ferm-header">
        <span>Day ${d.Day}</span>
        <span>${d.Gravity < 1.012 ? "Near Terminal" : "Active"}</span>
      </div>
      <div class="ferm-metrics">
        <div><strong>${d.Temp}°F</strong>Temp</div>
        <div><strong>${d.Gravity}</strong>Gravity</div>
        <div><strong>${d.pH}</strong>pH</div>
        <div><strong>${d.Pressure || "-"} PSI</strong>Pressure</div>
      </div>
      ${d.Notes ? `<small>${d.Notes}</small>` : ""}
    `;
    container.appendChild(card);
  });
}

function drawFermentationChart(data) {
  const ctx = document.getElementById("fermChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => `Day ${d.Day}`),
      datasets: [
        { label: "Gravity", data: data.map(d => d.Gravity) },
        { label: "Temp", data: data.map(d => d.Temp) },
        { label: "pH", data: data.map(d => d.pH) }
      ]
    }
  });
}
