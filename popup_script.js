// uses listener from background.js

// chrome.runtime.sendMessage({
//     message: "get_name"
// }, response => {
//     if (response.message === 'success') {
//         document.querySelector('div').innerHTML = `Hello ${response.payload}`;
//     }
// });


// unused code below, use contentScripts.js
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('testButton');
    btn.addEventListener('click', myFunction);
});

const myFunction = () => {
    console.log("test");
}