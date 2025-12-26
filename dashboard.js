const API =
"https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

let activeTank = null;
let activeBrew = null;
let fermChart = null;

document.addEventListener("DOMContentLoaded", loadTanks);

/* ===========================
   LOAD TANKS
=========================== */
function loadTanks() {
  fetch(`${API}?action=tanks`)
    .then(r => r.json())
    .then(data => {
      fermenters.innerHTML = "";
      brites.innerHTML = "";
      data.forEach(t => renderTank(t));
    });
}

function renderTank(t) {
  const status = t.Status.toUpperCase();
  const card = document.createElement("div");
  card.className = "dashboard-card";
  card.innerHTML = `
    <div class="tank-id">${t.TankID}</div>
    <div class="status ${status}">${t.Status}</div>
    <div class="meta">
      <strong>Active Brew:</strong> ${t.ActiveBrewID || "—"}
    </div>
  `;
  card.onclick = () => {
    status.includes("FERMENT")
      ? openFermentation(t.TankID, t.ActiveBrewID)
      : location.href = `brew-log.html?tank=${t.TankID}`;
  };
  (status.includes("FERMENT") ? fermenters : brites).appendChild(card);
}

/* ===========================
   FERMENTATION MODAL
=========================== */
function openFermentation(tank, brew) {
  activeTank = tank;
  activeBrew = brew;
  fermTitle.textContent = `Tank ${tank} – Active Fermentation`;
  fermModal.classList.remove("hidden");
  loadFermentation();
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("ferm-close"))
    fermModal.classList.add("hidden");
});

/* ===========================
   LOAD FERMENTATION DATA
=========================== */
function loadFermentation() {
  fetch(`${API}?action=fermentation&tank=${activeTank}&brewId=${activeBrew}`)
    .then(r => r.json())
    .then(data => {
      renderCards(data);
      drawChart(data);
      runFermentationIntelligence(data);
    });
}

/* ===========================
   RENDER DAILY CARDS
=========================== */
function renderCards(data) {
  fermCards.innerHTML = "";
  data.slice().reverse().forEach(d => {
    fermCards.innerHTML += `
      <div class="ferm-card">
        <div class="ferm-header">
          <span>Day ${d.Day}</span>
          <span>${d._status}</span>
        </div>
        <div class="ferm-metrics">
          <div><strong>${d.Temp}</strong>Temp</div>
          <div><strong>${d.Gravity}</strong>Gravity</div>
          <div><strong>${d.pH}</strong>pH</div>
          <div><strong>${d.Pressure || "-"}</strong>PSI</div>
        </div>
        ${d.Notes ? `<small>${d.Notes}</small>` : ""}
      </div>`;
  });
}

/* ===========================
   CHART
=========================== */
function drawChart(data) {
  if (fermChart) fermChart.destroy();
  fermChart = new Chart(fermChartEl, {
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

/* ===========================
   FERMENTATION INTELLIGENCE
=========================== */
function runFermentationIntelligence(data) {
  if (data.length < 3) {
    fermPrediction.textContent = "📈 Collecting data…";
    return;
  }

  const gravities = data.map(d => +d.Gravity);
  const temps = data.map(d => +d.Temp);

  const rate = fermentationRate(gravities);
  const terminal = estimateTerminalGravity(gravities);
  const stalled = isStalled(gravities);
  const nearTerminal = gravities.at(-1) <= terminal + 0.002;
  const tempDrift = temperatureDrift(temps);

  let status = "Active";
  let message = "🔥 Fermentation progressing normally";

  if (stalled) {
    status = "⚠️ Stalled";
    message = "⚠️ Gravity has stopped dropping — investigate yeast health";
  } else if (nearTerminal) {
    status = "Near Terminal";
    message = "✅ Prepare for diacetyl rest / crash window";
  }

  if (tempDrift) {
    message += " | 🌡 Temperature drift detected";
  }

  fermPrediction.innerHTML = `
    <strong>Status:</strong> ${status}<br>
    <strong>ΔSG/day:</strong> ${rate.toFixed(4)}<br>
    <strong>Est. Terminal:</strong> ${terminal.toFixed(3)}<br>
    <strong>Est. Days Remaining:</strong> ${estimateDaysRemaining(gravities, terminal)}<br>
    ${message}
  `;

  data.forEach(d => d._status = status);
}

/* ===========================
   INTELLIGENCE FUNCTIONS
=========================== */
function fermentationRate(g) {
  const recent = g.slice(-3);
  return (recent[0] - recent.at(-1)) / (recent.length - 1);
}

function estimateTerminalGravity(g) {
  const drops = [];
  for (let i = 1; i < g.length; i++) drops.push(g[i - 1] - g[i]);
  const avgDrop = drops.slice(-4).reduce((a, b) => a + b, 0) / 4;
  return g.at(-1) - avgDrop * 2;
}

function estimateDaysRemaining(g, terminal) {
  const rate = fermentationRate(g);
  if (rate <= 0) return "Unknown";
  return Math.max(0, ((g.at(-1) - terminal) / rate).toFixed(1));
}

function isStalled(g) {
  return Math.abs(g.at(-1) - g.at(-3)) < 0.001;
}

function temperatureDrift(t) {
  return Math.max(...t.slice(-3)) - Math.min(...t.slice(-3)) > 3;
}

/* ===========================
   SAVE DAILY ENTRY
=========================== */
saveFermEntry.onclick = () => {
  const payload = {
    action: "saveFermentation",
    tank: activeTank,
    brewId: activeBrew,
    temp: fTemp.value,
    gravity: fGravity.value,
    ph: fPH.value,
    pressure: fPressure.value,
    notes: fNotes.value
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => loadFermentation());
};
