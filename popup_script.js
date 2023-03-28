// uses listener from background.js

// chrome.runtime.sendMessage({
//     message: "get_name"
// }, response => {
//     if (response.message === 'success') {
//         document.querySelector('div').innerHTML = `Hello ${response.payload}`;
//     }
// });

// async function fetchEmail(url) {
//     const response = await fetch(url);
//     return response.json();
// }

document.addEventListener('DOMContentLoaded', async function () {
    console.log("hi");

    var emailAddress = document.getElementById('email-address');

    chrome.identity.getAuthToken(
        { 'interactive': true },
        async function (token) {
            const email = await getEmailPromise('/profile', 'GET', token);
            emailAddress.innerText = JSON.parse(email)["emailAddress"];
        }
    );

});

// from contentScripts.js, TODO: maybe put them into one file?
// accesses google api to get information about emails
function getEmailPromise(query, queryType, atoken) {
    return new Promise((resolve, reject) => {
        let Http = new XMLHttpRequest();
        const url = "https://gmail.googleapis.com/gmail/v1/users/me" + query;
        Http.open(queryType, url);
        Http.setRequestHeader("Content-Type", "application/json");
        Http.setRequestHeader("Authorization", `Bearer ${atoken}`);
        Http.send();

        Http.onload = () => {
            if (Http.status >= 200 && Http.status < 300) {
                resolve(Http.response);
            } else {
                reject(Http.statusText);
            }
        };
        Http.onerror = () => reject(Http.statusText);
    });
}
