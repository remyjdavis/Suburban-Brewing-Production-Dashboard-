<script>
document.addEventListener("DOMContentLoaded", () => {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  console.log("FERM DIV:", ferm);
  console.log("BRITE DIV:", brite);

  const testCard = document.createElement("div");
  testCard.style.border = "2px solid red";
  testCard.style.padding = "10px";
  testCard.style.color = "black";
  testCard.textContent = "TEST CARD — IF YOU SEE THIS, DOM IS WORKING";

  ferm.appendChild(testCard);
});
</script>
