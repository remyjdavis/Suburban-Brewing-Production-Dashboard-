const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*************************************************
 * INIT — SINGLE SOURCE OF TRUTH
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  autoGenerateBrewId();

  const saveBtn = document.getElementById("saveBrewLog");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveBrewLog);
  }

  // 🔥 BACK TO DASHBOARD — THIS WILL WORK
  const backBtn = document.getElementById("backToDashboard");
  if (!backBtn) {
    console.error("❌ backToDashboard button not found");
  } else {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });
    console.log("✅ Back to Dashboard wired");
  }
});

/*************************************************
 * BREW ID
 *************************************************/
function autoGenerateBrewId() {
  const brewId = document.getElementById("brewId");
  const tank = document.getElementById("tank");
  if (!brewId || !tank) return;

  const today = new Date().toISOString().split("T")[0];
  brewId.value = `${today}-${tank.value || "FV"}`;
}

/*************************************************
 * TANKS
 *************************************************/
function populateTanks() {
  const tank = document.getElementById("tank");
  if (!tank) return;

  tank.innerHTML = `<option value="">Tank</option>`;

  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tank.appendChild(o);
  });
}

/*************************************************
 * SAVE BREW LOG
 *************************************************/
function collectFormData() {
  return {
    BrewID: document.getElementById("brewId")?.value || "",
    Date: document.getElementById("date")?.value || "",
    Tank: document.getElementById("tank")?.value || "",
    RecipeID: document.getElementById("recipe")?.value || "",
    Brewer: document.getElementById("brewer")?.value || ""
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

  alert("Brew log saved");
}
