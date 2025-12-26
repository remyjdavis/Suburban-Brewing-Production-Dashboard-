const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*************************************************
 * INIT
 *************************************************/

document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  loadRecipes();
  autoGenerateBrewId();

  document.getElementById("saveBrewLog").onclick = saveBrewLog;
});

/*************************************************
 * BREW ID
 *************************************************/

function autoGenerateBrewId() {
  const brewId = document.getElementById("brewId");
  const tank = document.getElementById("tank");
  const today = new Date().toISOString().split("T")[0];
  brewId.value = `${today}-${tank.value || "FV"}`;
}

/*************************************************
 * TANKS
 *************************************************/

function populateTanks() {
  const tank = document.getElementById("tank");
  tank.innerHTML = `<option value="">Tank</option>`;

  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tank.appendChild(o);
  });
}

/*************************************************
 * SAVE BREW LOG (THIS IS IT)
 *************************************************/

function collectFormData() {
  return {
    BrewID: document.getElementById("brewId").value,
    Date: document.getElementById("date").value,
    Tank: document.getElementById("tank").value,
    RecipeID: document.getElementById("recipe").value,
    Brewer: document.getElementById("brewer").value
  };
}

function saveBrewLog() {
  const payload = collectFormData();

  navigator.sendBeacon(
    `${API}?action=saveBrewLog`,
    new Blob([JSON.stringify(payload)], {
      type: "application/json"
    })
  );
}
