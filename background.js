let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("mail.google.com/mail/u")) {
    console.log("hey")
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token)
       chrome.tabs.sendMessage(tabId, {
         token: token
       });
   });
  }
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log(tab.url);
//   if (
//     changeInfo.status === "complete" &&
//     /^https\:\/\/mail\.google\.com\/./.test(tab.url)
//   ) {
//     chrome.scripting
//       .insertCSS({
//         target: { tabId: tabId },
//         files: ["./foreground_styles.css"],
//       })
//       .then(() => {
//         console.log("INJECTED THE FOREGROUND STYLES.");

//         chrome.scripting
//           .executeScript({
//             target: { tabId: tabId },
//             files: ["./contentScrips.js"],
//           })
//           .then(() => {
//             console.log("INJECTED THE FOREGROUND SCRIPT.");
//           });
//       })
//       .catch((err) => console.log(err));
//   }
// });
