const ce_main_container = document.createElement("DIV");
const ce_name = document.createElement("DIV");

ce_main_container.classList.add("testelement");
ce_name.id = "ce_name";

ce_name.innerHTML = `icon`;

ce_main_container.appendChild(ce_name);

//   const label_container = document.createElement("LI");

//   label_container.classList.add("testelement");
//   label_name.id = "label_name";

//   label_container.innerHTML = `nomail`;

//   label_container.appendChild(label_name);

// Callback function to execute when mutations are observed

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    console.log(mutation.type, "mutation");
  }
};

const injectLabelIntoContainer = () => {
  let containers = document.getElementsByClassName("bqY");

  if (containers && containers.length > 0) {
    for (let container of containers) {
      if (
        container &&
        !container.lastElementChild.classList.contains("nomail")
      ) {
        // buttonContainer.style.display = "flex";

        // let container = buttonContainer.childNodes[0];
        let insert = document.createElement("li");
        insert.classList.add("bqX");
        insert.classList.add("bru");
        insert.classList.add("nomail");
        insert.style.border = "3px solid #FF0000";

        container.appendChild(insert);
      } else {
        setTimeout(() => injectLabelIntoContainer(), 200);
      }
    }
  } else {
    setTimeout(() => injectLabelIntoContainer(), 200);
  }

  // setTimeout(() => injectLabelIntoContainer(), 200);
};

//   // Later, you can stop observing
//   observer.disconnect();

const injectIconIntoContainer = (icon) => {
  // Recursively waits for the icon container to load and injects an
  // icon into it when it does

  let iconContainer = document.getElementsByClassName("G-Ni G-aE J-J5-Ji")[1];

  if (iconContainer !== undefined && iconContainer != null) {
    iconContainer.appendChild(ce_main_container);
  } else {
    setTimeout(() => injectIconIntoContainer(icon), 200);
  }
};

document.addEventListener(
  "DOMContentLoaded",
  function () {
    injectLabelIntoContainer();
  },
  false
);
setTimeout(() => injectLabelIntoContainer(), 5000);

injectIconIntoContainer(ce_main_container);
