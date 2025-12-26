const API =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const params = new URLSearchParams(window.location.search);
const brewId = params.get("brewId");
const tank = params.get("tank");

const table = document.getElementById("fermentationTable");

document.getElementById("saveFermentation").addEventListener("click", save);

loadFermentation();

function loadFermentation() {
  fetch(`${API}?action=fermentation&brewId=${brewId}`)
    .then(r => r.json())
    .then(data => {
      table.innerHTML = "";

      data
        .sort((a, b) => b.Day - a.Day)
        .forEach(r => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>Day ${r.Day}</td>
            <td>${r.Temp || ""}</td>
            <td>${r.Gravity || ""}</td>
            <td>${r.pH || ""}</td>
            <td>${r.Pressure || ""}</td>
            <td>${r.Notes || ""}</td>
          `;
          table.appendChild(row);
        });
    });
}

function save() {
  const payload = {
    BrewID: brewId,
    Tank: tank,
    Temp: document.getElementById("temp").value,
    Gravity: document.getElementById("gravity").value,
    pH: document.getElementById("ph").value,
    Pressure: document.getElementById("pressure").value,
    Notes: document.getElementById("notes").value
  };

  fetch(`${API}?action=saveFermentation`, {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(() => {
      clearForm();
      loadFermentation();
    });
}

function clearForm() {
  ["temp", "gravity", "ph", "pressure", "notes"].forEach(id => {
    document.getElementById(id).value = "";
  });
}
