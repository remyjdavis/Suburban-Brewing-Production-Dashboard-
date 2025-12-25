const params = new URLSearchParams(location.search);
const tank = params.get("tank");
document.getElementById("tank").value = tank;
document.getElementById("date").valueAsDate = new Date();

function saveBrew() {
  const payload = {
    batchId: crypto.randomUUID(),
    tank,
    beer: beer.value,
    brewer: brewer.value,
    date: date.value,
    mash: {
      pH: mashPh.value,
      notes: mashNotes.value
    },
    lauter: {
      first: firstRun.value,
      final: finalRun.value,
      notes: lauterNotes.value
    },
    boil: {
      pre: preBoil.value,
      post: postBoil.value,
      notes: boilNotes.value
    },
    knockout: {
      temp: koTemp.value,
      pH: koPh.value,
      notes: koNotes.value
    },
    checkedBy: checkedBy.value
  };

  fetch("PASTE_YOUR_SCRIPT_URL_HERE", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => alert("Brew Log Saved"));
}
