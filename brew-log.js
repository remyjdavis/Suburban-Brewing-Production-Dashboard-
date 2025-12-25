/*********************************************************
 * AUTO-SELECT TANK BASED ON CLICK SOURCE (DO NOT REMOVE)
 *********************************************************/
document.addEventListener("click", (e) => {
  if (e.target.dataset && e.target.dataset.tank) {
    const tankInput = document.getElementById("tank");
    if (tankInput) {
      tankInput.value = e.target.dataset.tank;
    }
  }
});

/*********************************************************
 * GRAIN BILL – POPULATE GRAINS
 *********************************************************/
const grains = ["Pilsner", "Munich"];
const grainTable = document.getElementById("grainTable");

if (grainTable) {
  grainTable.innerHTML = "";

  grains.forEach(grain => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${grain}</td>
      <td>—</td>
      <td><input type="number"></td>
    `;
    grainTable.appendChild(tr);
  });
}

/*********************************************************
 * MASH SCHEDULE
 *********************************************************
 * Mash Schedule is intentionally STATIC HTML.
 * Do NOT generate rows here.
 * This preserves:
 * - pH inputs
 * - Start / End time inputs
 * - Spacing & layout
 *********************************************************/

/*********************************************************
 * WATER PROFILE
 *********************************************************
 * Static inputs controlled by HTML + CSS grid.
 * JS intentionally does nothing here.
 *********************************************************/

/*********************************************************
 * LAUTER TUN
 *********************************************************
 * Static layout to maintain column alignment.
 * JS intentionally does nothing here.
 *********************************************************/

/*********************************************************
 * BOIL
 *********************************************************
 * Start / End inputs handled in HTML.
 *********************************************************/

/*********************************************************
 * KNOCKOUT
 *********************************************************
 * Volume / Gravity / pH handled in HTML.
 *********************************************************/

/*********************************************************
 * YEAST (TO BE ADDED LATER)
 *********************************************************
 * Placeholder for future yeast logic.
 *********************************************************/

/*********************************************************
 * SAVE BUTTON (FUTURE)
 *********************************************************
 * Data collection & persistence comes later.
 *********************************************************/
