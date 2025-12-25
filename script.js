document.addEventListener("DOMContentLoaded", () => {
  const API =
    "YOUR_SCRIPT_URL?action=tanks";

  fetch(API)
    .then(r => r.json())
    .then(render);
});

function render(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const status = (t.Status || "empty").toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;
    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "—"}</div>
    `;

    if (status === "empty") {
      card.addEventListener("click", () => {
        window.location.href =
          `brew-log.html?tank=${encodeURIComponent(t.TankID)}`;
      });
    }

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
