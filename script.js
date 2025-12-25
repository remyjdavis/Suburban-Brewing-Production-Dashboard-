const API =
  "PASTE_YOUR_SCRIPT_URL_HERE?action=tanks";

fetch(API)
  .then(r => r.json())
  .then(tanks => {
    const ferm = document.getElementById("fermentation");
    const brite = document.getElementById("brite");

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
        card.onclick = () =>
          location.href = `brew-log.html?tank=${encodeURIComponent(t.TankID)}`;
      }

      (t.Type === "Fermenter" ? ferm : brite).appendChild(card);
    });
  });
