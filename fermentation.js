const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*************************************************
 * URL PARAMS
 *************************************************/
const params = new URLSearchParams(window.location.search);
const brewId = params.get("brewId");
const tank = params.get("tank");

/*************************************************
 * INIT
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  if (!brewId || !tank) {
    alert("Missing fermentation context");
    return;
  }

  document.getElementById("brewId").textContent = brewId;
  document.getElementById("tankId").textContent = tank;

  loadFermentationLog();
  enforceWeekdayRule();

  document
    .getElementById("saveFermentation")
    .addEventListener("click", saveFermentation);

  document
    .getElementById("backToDashboard")
    .addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
});

/*************************************************
 * WEEKDAY ENFORCEMENT (MON–FRI)
 *************************************************/
function isWeekday() {
  const day = new Date().getDay(); // 0=Sun, 6=Sat
  return day >= 1 && day <= 5;
}

function enforceWeekdayRule() {
  const btn = document.getElementById("saveFermentation");

  if (!isWeekday()) {
    btn.disabled = true;
    btn.textContent = "Weekday Entries Only";
  }
}

/*************************************************
 * LOAD FERMENTATION LOG (SORTED)
 *************************************************/
function loadFermentationLog() {
  fetch(`${API}?action=fermentation&brewId=${encodeURIComponent(brewId)}`)
    .then(r => r.json())
    .then(rows => {
      const tbody = document.getElementById("fermentationTable");
      tbody.innerHTML = "";

      if (!Array.isArray(rows) || rows.length === 0) return;

      rows
        .sort((a, b) => b.Day - a.Day)
        .forEach(r => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>Day ${r.Day}</td>
            <td>${r.Temp ?? ""}</td>
            <td>${r.Gravity ?? ""}</td>
            <td>${r.pH ?? ""}</td>
            <td>${r.Pressure ?? ""}</td>
            <td>${r.Notes ?? ""}</td>
          `;
          tbody.appendChild(tr);
        });
    })
    .catch(err => console.error(err));
}

/*************************************************
 * SAVE FERMENTATION ENTRY
 * (Weekdays only, Day server-calculated)
 *************************************************/
function saveFermentation() {
  if (!isWeekday()) {
    alert("Daily fermentation entries are allowed Monday through Friday only.");
    return;
  }

  const payload = {
    BrewID: brewId,
    Tank: tank,
    Temp: document.getElementById("temp").value,
    Gravity: document.getElementById("gravity").value,
    pH: document.getElementById("ph").value,
    Pressure: document.getElementById("pressure").value,
    Notes: document.getElementById("notes").value
  };

  const blob = new Blob(
    [JSON.stringify(payload)],
    { type: "text/plain" }
  );

  navigator.sendBeacon(
    `${API}?action=saveFermentation`,
    blob
  );

  clearInputs();

  // Reload to get correct Day from server
  setTimeout(loadFermentationLog, 300);
}

/*************************************************
 * UI HELPERS
 *************************************************/
function clearInputs() {
  ["temp", "gravity", "ph", "pressure", "notes"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
