const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

fetch(`${API}?action=tanks`)
  .then(r => r.json())
  .then(tanks => {
    if (!Array.isArray(tanks)) throw "Tank data invalid";

    const ferm = document.getElementById("fermentation");
    const brite = document.getElementById("brite");

    tanks.forEach(t => {
      const status = (t.Status || "empty").toLowerCase();

      const card = document.createElement("div");
      card.className = `tank ${status}`;
      card.innerHTML = `
        <h4>${t.TankID}</h4>
        <div>${t.Status || "Empty"}</div>
      `;

      if (status === "empty") {
        card.onclick = () =>
          window.location.href = `brew-log.html?tank=${t.TankID}`;
      }

      (t.Type === "Fermenter" ? ferm : brite).appendChild(card);
    });
  })
  .catch(err => console.error(err));
