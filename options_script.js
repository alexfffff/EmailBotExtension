(() => {
  document.addEventListener("DOMContentLoaded", async function () {
    var backBtn = document.getElementById("popup");

    backBtn.addEventListener("click", function () {
      window.location.href = "popup.html";
    });
  });
})();
