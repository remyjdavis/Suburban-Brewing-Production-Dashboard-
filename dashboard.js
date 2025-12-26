const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

console.log("DASHBOARD JS LOADED", Date.now());

document.addEventListener("DOMContentLoaded", () => {
  const fermenters = document.getElementById("fermenters");
  const brites = document.getElementById("brites");

  if (!fermenters || !brites) {
    console.error("Dashboard containers missing");
    return;
  }

  fetch(`${API}?action=tanks&_=${Date.now()}`)
    .then(res => res.json())
    .then(tanks => {
      console.table(tanks);

      fermenters.innerHTML = "";
      brites.innerHTML = "";

      tanks.forEach(t => {
        const id = String(t.TankID || "").trim().toUpperCase();
        const status = String(t.Status || "AVAILABLE").toUpperCase();

        const card = document.createElement("div");
        card.className = "card clickable";

        card.innerHTML = `
          <div class="tank-id">${id || "—"}</div>
          <div class="status ${status}">${status}</div>
          <div class="meta">
            <strong>Active Brew:</strong> ${t.ActiveBrewID || "—"}<br>
            <strong>Last Brew:</strong> ${t.LastBrewDate || "—"}
          </div>
        `;

        // 🔥 INLINE ROUTING
        card.onclick = () => {
          if (status === "FERMENTING") {
            openFermentation(t.ActiveBrewID, id);
          } else {
            window.location.href =
              "brew-log.html?" +
              new URLSearchParams({ tank: id }).toString();
          }
        };

        // 🔒 BUCKETING
        if (id.startsWith("FV")) {
          fermenters.appendChild(card);
        } else if (id.startsWith("BT")) {
          brites.appendChild(card);
        } else {
          console.warn("Unknown TankID:", id);
        }
      });
    })
    .catch(err => console.error("Dashboard load failed:", err));
});

/*************************************************
 * FERMENTATION MODULE (INLINE)
 *************************************************/

function sgToPlato(sg) {
  const s = parseFloat(sg);
  if (isNaN(s)) return null;
  return (
    -616.868 +
    1111.14 * s -
    630.272 * s * s +
    135.997 * s * s * s
  ).toFixed(2);
}

function openFermentation(brewId, tank) {
  if (!brewId) {
    alert("No active brew on this tank");
    return;
  }

  fermCard.style.display = "block";
  fermBrew.textContent = brewId;
  fermTank.textContent = tank;

  loadFermentation(brewId);

  fSave.onclick = () => saveFermentation(brewId, tank);
}

function loadFermentation(brewId) {
  fetch(`${API}?action=fermentation&brewId=${encodeURIComponent(brewId)}`)
    .then(r => r.json())
    .then(rows => {
      rows.sort((a, b) => b.Day - a.Day);
      renderFermentationHistory(rows);
      prefillYesterday(rows);
      renderFermentationAlerts(rows);
      drawFermentationGraph(rows);
    });
}

function prefillYesterday(rows) {
  if (!rows[0]) return;
  fTemp.value = rows[0].Temp || "";
  fPlato.value = rows[0].Plato || "";
  fPsi.value = rows[0].Pressure || "";
}

function saveFermentation(brewId, tank) {
  let plato = fPlato.value.trim();
  const sg = fSG.value.trim();

  if (!plato && !sg) {
    alert("Enter Plato or SG");
    return;
  }
  if (plato && sg) {
    alert("Enter Plato OR SG, not both");
    return;
  }
  if (!plato && sg) {
    plato = sgToPlato(sg);
  }

  const payload = {
    BrewID: brewId,
    Tank: tank,
    Temp: fTemp.value,
    Plato: plato,
    pH: fPh.value,
    Pressure: fPsi.value,
    Notes: fNotes.value
  };

  navigator.sendBeacon(
    `${API}?action=saveFermentation`,
    new Blob([JSON.stringify(payload)], { type: "text/plain" })
  );

  fPlato.value = "";
  fSG.value = "";
  fNotes.value = "";

  setTimeout(() => loadFermentation(brewId), 300);
}

function renderFermentationHistory(rows) {
  fermHistory.innerHTML = "";
  rows.forEach(r => {
    fermHistory.innerHTML += `
      <tr>
        <td>Day ${r.Day}</td>
        <td>${r.Temp || ""}</td>
        <td>${r.Plato || ""}</td>
        <td>${r.pH || ""}</td>
        <td>${r.Pressure || ""}</td>
        <td>${r.Notes || ""}</td>
      </tr>`;
  });
}

function renderFermentationAlerts(rows) {
  fermAlerts.textContent = "";
  if (rows.length < 2) return;

  const alerts = [];

  if (rows[0].Temp - rows[1].Temp > 2) {
    alerts.push("⚠ Temp Rising Quickly");
  }

  if (rows[1].Plato - rows[0].Plato > 1.5) {
    alerts.push("⚠ Rapid Attenuation");
  }

  fermAlerts.textContent = alerts.join(" • ");
}

function drawFermentationGraph(rows) {
  const ctx = fermGraph.getContext("2d");
  ctx.clearRect(0, 0, fermGraph.width, fermGraph.height);

  const p = rows
    .map(r => parseFloat(r.Plato))
    .filter(v => !isNaN(v));

  if (p.length < 2) return;

  ctx.beginPath();
  p.forEach((v, i) => {
    const x = i * 30;
    const y = 70 - v * 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}
