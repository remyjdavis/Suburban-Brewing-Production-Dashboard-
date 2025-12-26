const API =
"https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

let activeTank = null;
let activeBrew = null;
let fermChart = null;

document.addEventListener("DOMContentLoaded", loadTanks);

/* LOAD TANKS */
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

/* OPEN MODAL */
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

/* LOAD FERMENTATION */
function loadFermentation() {
  fetch(`${API}?action=fermentation&tank=${activeTank}&brewId=${activeBrew}`)
    .then(r => r.json())
    .then(data => {
      renderCards(data);
      drawChart(data);
      showPrediction(data);
    });
}

/* RENDER CARDS */
function renderCards(data) {
  fermCards.innerHTML = "";
  data.slice().reverse().forEach(d => {
    fermCards.innerHTML += `
      <div class="ferm-card">
        <div class="ferm-header">
          <span>Day ${d.Day}</span>
          <span>${fermentationStatus(data)}</span>
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

/* CHART */
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

/* ML-LITE LOGIC */
function fermentationStatus(data) {
  if (data.length < 3) return "Active";
  const g = data.map(d => d.Gravity);
  const delta = Math.abs(g[g.length-1] - g[g.length-3]);
  if (delta < 0.001) return "⚠️ Stalled";
  if (g[g.length-1] < 1.012) return "Near Terminal";
  return "Active";
}

function showPrediction(data) {
  const status = fermentationStatus(data);
  fermPrediction.textContent =
    status === "Near Terminal"
      ? "✅ Ready for crash / VDK rest soon"
      : status === "⚠️ Stalled"
      ? "⚠️ Investigate fermentation"
      : "🔥 Active fermentation progressing";
}

/* SAVE DAILY READING */
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
