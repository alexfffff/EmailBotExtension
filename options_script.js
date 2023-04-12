(() => {
  document.addEventListener("DOMContentLoaded", async function () {
    var backBtn = document.getElementById("popup");

    backBtn.addEventListener("click", function () {
      window.location.href = "popup.html";
    });

    let {
      button: button,
      days: days,
      threshold: threshold,
    } = { ...localStorage };

    var toggle = document.getElementById("send");
    var checked = button === "send" ? true : false;
    if (button !== null) {
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
    if (days === null) {
      localStorage.setItem("days", "3");
    }
    daysInput.value = days || "3";

    daysInput.addEventListener("change", function () {
      localStorage.setItem("days", this.value);
    });

    var thresholdInput = document.getElementById("threshold");
    if (threshold === null) {
      localStorage.setItem("threshold", "100");
    }
    thresholdInput.value = threshold || "100";

    thresholdInput.addEventListener("change", function () {
      localStorage.setItem("threshold", this.value);
    });
  });
})();
