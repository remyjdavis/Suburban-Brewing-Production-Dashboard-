const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

fetch(`${API}?action=tanks`)
  .then(response => response.json())
  .then(tanks => {
    if (!Array.isArray(tanks)) {
      throw "Tank data invalid";
    }

    const fermentation = document.getElementById("fermentation");
    const brite = document.getElementById("brite");

    tanks.forEach(tank => {
      const status = (tank.Status || "empty").toLowerCase();

      const card = document.createElement("div");
      card.className = `tank status-${status}`;

      card.innerHTML = `
        <h4>${tank.TankID}</h4>
        <p>Status: ${tank.Status || "Empty"}</p>
      `;

      if (status === "empty") {
        card.onclick = () => {
          window.location.href = `brew-log.html?tank=${tank.TankID}`;
        };
      }

      if (tank.Type === "Fermenter") {
        fermentation.appendChild(card);
      } else {
        brite.appendChild(card);
      }
    });
  })
  .catch(err => console.error(err));
