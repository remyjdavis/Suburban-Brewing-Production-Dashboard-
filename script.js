const API = "YOUR_DEPLOYED_SCRIPT_URL";

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("fermentation")) loadTanks();
  if (document.getElementById("recipe")) loadBrewLog();
});

function loadTanks() {
  fetch(API + "?action=tanks")
    .then(r => r.json())
    .then(tanks => {
      tanks.forEach(t => {
        const card = document.createElement("div");
        card.className = `tank status-${t.Status.toLowerCase()}`;
        card.innerHTML = `<h4>${t.TankID}</h4><div>${t.Status}</div>`;
        card.onclick = () => {
          if (t.Status === "Empty") {
            window.location = `brew-log.html?tank=${t.TankID}`;
          }
        };
        document.getElementById(
          t.Type === "Fermenter" ? "fermentation" : "brite"
        ).appendChild(card);
      });
    });
}

function loadBrewLog() {
  const tank = new URLSearchParams(window.location.search).get("tank");
  document.getElementById("tank").value = tank;

  fetch(API + "?action=recipes")
    .then(r => r.json())
    .then(recipes => {
      const sel = document.getElementById("recipe");
      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        sel.appendChild(o);
      });
    });
}

function saveBrew() {
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      tank: tank.value,
      recipe: recipe.value,
      mashPH: mashPH.value,
      koSG: koSG.value,
      koVol: koVol.value
    })
  }).then(() => alert("Saved"));
}
