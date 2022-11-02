const ce_main_container = document.createElement("DIV");
const ce_name = document.createElement("DIV");

ce_main_container.classList.add("testelement");
ce_name.id = "ce_name";

ce_name.innerHTML = `icon`;

ce_main_container.appendChild(ce_name);

const injectIconIntoContainer = icon => {
    // Recursively waits for the icon container to load and injects an
    // icon into it when it does

    let iconContainer = document.getElementsByClassName(
        "G-Ni G-aE J-J5-Ji"
    )[1];

    if (iconContainer !== undefined && iconContainer != null) {
        console.log("hi");
        iconContainer.appendChild(ce_main_container);
    } else {
        setTimeout(() => injectIconIntoContainer(icon), 200);
    }
};

injectIconIntoContainer(ce_main_container);
