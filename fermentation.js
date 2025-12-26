const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const params = new URLSearchParams(window.location.search);
const brewId = params.get("brewId");
const tank = params.get("tank");

const tbody = document.getElementById("fermentationTable");

document.getElementById("title").textContent =
  `Fermentation — ${tank}`;

fetch(`${API}?action=fermentation&brewId=${brewId}`)
  .then(r => r.json())
  .then(rows => rows.forEach(addRowFromData));

document.getElementById("addRow").onclick = () => addRow();
document.getElementById("saveFermentation").onclick = saveAll;

function addRowFromData(d = {}) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input value="${d.Day || ""}"></td>
    <td><input value="${d.Temp || ""}"></td>
    <td><input value="${d.Gravity || ""}"></td>
    <td><input value="${d.pH || ""}"></td>
    <td><input value="${d.Pressure || ""}"></td>
    <td><input value="${d.Notes || ""}"></td>
  `;
  tbody.appendChild(tr);
}

function addRow() {
  addRowFromData();
}

function saveAll() {
  [...tbody.children].forEach((tr, i) => {
    const inputs = tr.querySelectorAll("input");

    navigator.sendBeacon(
      `${API}?action=saveFermentation`,
      new Blob([JSON.stringify({
        BrewID: brewId,
        Tank: tank,
        Day: inputs[0].value,
        Temp: inputs[1].value,
        Gravity: inputs[2].value,
        pH: inputs[3].value,
        Pressure: inputs[4].value,
        Notes: inputs[5].value
      })], { type: "text/plain" })
    );
  });
}
