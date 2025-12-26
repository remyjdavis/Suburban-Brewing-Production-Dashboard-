const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

console.log("DASHBOARD JS LOADED", Date.now());

document.addEventListener("DOMContentLoaded", () => {
  loadTanks();

  document.querySelector(".ferm-close").onclick = closeFermModal;
});

/*************************************************
 * LOAD TANKS
 *************************************************/
function loadTanks() {
  fetch(`${API}?action=tanks`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("fermenters").innerHTML = "";
      document.getElementById("brites").innerHTML = "";

      data.forEach(t => renderTank(t));
    });
}

/*************************************************
 * RENDER TANK CARD
 *************************************************/
function renderTank(t) {
  const card = document.createElement("div");
  card.className = "dashboard-card";

  card.innerHTML = `
    <div class="tank-id">${t.TankID}</div>
    <div class="status ${t.Status}">${t.Status}</div>
    <div class="meta">
      <strong>Brew:</strong> ${t.ActiveBrewID || "—"}
    </div>
  `;

  card.onclick = () => {
    if (t.Status === "FERMENTING") {
      openFermModal(t);
    } else {
      window.location.href = `brew-log.html?tank=${t.TankID}`;
    }
  };

  const bucket =
    t.Status === "FERMENTING"
      ? "fermenters"
      : "brites";

  document.getElementById(bucket).appendChild(card);
}

/*************************************************
 * FERMENTATION MODAL
 *************************************************/
function openFermModal(tank) {
  document.getElementById("fermModal").classList.remove("hidden");
  document.getElementById("fermTitle").innerText =
    `Tank ${tank.TankID} — ${tank.ActiveBrewID}`;

  fetch(`${API}?action=fermentation&brewId=${tank.ActiveBrewID}`)
    .then(r => r.json())
    .then(data => {
      renderFermCards(data);
      renderFermChart(data);
    });
}

function closeFermModal() {
  document.getElementById("fermModal").classList.add("hidden");
}

/*************************************************
 * FERMENTATION CARDS
 *************************************************/
function renderFermCards(data) {
  const c = document.getElementById("fermCards");
  c.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "ferm-card";

    div.innerHTML = `
      <div class="ferm-header">
        <span>Day ${d.Day}</span>
        <span>${new Date(d.Timestamp).toLocaleDateString()}</span>
      </div>
      <div class="ferm-metrics">
        <div><strong>${d.Temp}</strong>°F</div>
        <div><strong>${d.Plato}</strong>°P</div>
        <div><strong>${d.pH}</strong> pH</div>
        <div><strong>${d.Pressure}</strong> PSI</div>
      </div>
      <em>${d.Notes || ""}</em>
    `;

    c.appendChild(div);
  });
}

/*************************************************
 * FERMENTATION CHART
 *************************************************/
function renderFermChart(data) {
  const ctx = document.getElementById("fermChart").getContext("2d");

  const days = data.map(d => d.Day);
  const gravity = data.map(d => d.Plato);
  const temp = data.map(d => d.Temp);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Gravity",
          data: gravity,
          yAxisID: "y1"
        },
        {
          label: "Temp",
          data: temp,
          yAxisID: "y2"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y1: { position: "left" },
        y2: { position: "right" }
      }
    }
  });
}
