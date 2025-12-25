const API_URL =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=tanks";

fetch(API_URL)
  .then(res => res.json())
  .then(data => renderTanks(data));

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  tanks.forEach(t => {
    const card = document.createElement("div");
    card.className = `tank status-${t.Status.toLowerCase()}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Day:</strong> ${t.Day || "—"}</div>
      <div><strong>Status:</strong> ${t.Status}</div>
    `;

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
