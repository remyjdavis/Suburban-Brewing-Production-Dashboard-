const API = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
let selectedTank = "";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API}?action=tanks`)
    .then(r => r.json())
    .then(showEmptyTanks);
});

function showEmptyTanks(tanks) {
  empty_tanks.innerHTML = "";

  tanks
    .filter(t => !t.Status || t.Status.toLowerCase() === "empty")
    .forEach(t => {
      const card = document.createElement("div");
      card.className = "tank selectable";
      card.innerHTML = `<h4>${t.TankID}</h4><div>EMPTY</div>`;
      card.onclick = () => selectTank(t.TankID);
      empty_tanks.appendChild(card);
    });
}

function selectTank(tankId) {
  selectedTank = tankId;
  brewday_section.classList.remove("hidden");
  brewday_title.textContent = `Brew Day – ${tankId}`;
}

add_grain.onclick = () => {
  const r = document.createElement("tr");
  r.innerHTML = "<td><input></td><td><input></td>";
  grain_table.appendChild(r);
};

brewday_form.onsubmit = e => {
  e.preventDefault();

  const grain = [...grain_table.querySelectorAll("tr")]
    .slice(1)
    .map(r => ({
      grain: r.children[0].firstChild.value,
      weight: r.children[1].firstChild.value
    }))
    .filter(g => g.grain);

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      BrewDate: brewday_date.value,
      Beer: beer_name.value,
      Brewer: brewer.value,
      Batch: batch_id.value,
      Tank: selectedTank,
      Stage: "Brew Day",
      Notes: JSON.stringify({
        grain,
        water: water.value,
        mash: mash.value,
        lauter: lauter.value,
        boil: boil.value,
        ko: ko.value
      })
    })
  }).then(() => {
    alert("Brew Day Started");
    location.reload();
  });
};
