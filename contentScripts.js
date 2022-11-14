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

// needed functions for frontend //

// options page
/* > get thresholds
 * > toggle auto deletion
 * > change default nomail label to a custom one 
 *   (just pick from preexisting labels)
 *   will need functions to retrieve existing labels as well as set the default label to nomail spam
 * > get nomail marked spam from certain dates for metrics
 * > get total nomails deleted
 * > get total spamn identified
 * > get total false detected emails
 * > get total emails to be reviewed (emails in nomail label)
 * 
 */
