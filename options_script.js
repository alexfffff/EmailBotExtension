(() => {
  document.addEventListener("DOMContentLoaded", async function () {
    var backBtn = document.getElementById("popup");

    backBtn.addEventListener("click", function () {
      window.location.href = "popup.html";
    });

    var toggle = document.getElementById("send");
    var checked = localStorage.getItem("button") === "send" ? true : false;
    if (localStorage.getItem("button") !== null) {
      toggle.checked = checked;
    } else {
      localStorage.setItem("button", "send");
      toggle.checked = true;
    }
    toggle.addEventListener("change", function () {
      let itemval = this.checked ? "send" : "dontsend";
      localStorage.setItem("button", itemval);
    });

    var daysInput = document.getElementById("days");
    var daysOld = localStorage.getItem("days");
    if (daysOld === null) {
      localStorage.setItem("days", "3");
    }
    daysInput.value = daysOld || "3";

    daysInput.addEventListener("change", function () {
      localStorage.setItem("days", this.value);
    });

    var thresholdInput = document.getElementById("threshold");
    var threshold = localStorage.getItem("threshold");
    if (threshold === null) {
      localStorage.setItem("threshold", "100");
    }
    thresholdInput.value = threshold || "100";

    thresholdInput.addEventListener("change", function () {
      localStorage.setItem("threshold", this.value);
    });
  });
})();
