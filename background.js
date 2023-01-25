let color = "#3aa757";

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log("Default background color set to %cgreen", `color: ${color}`);
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (tab.url && tab.url.includes("mail.google.com/mail/u")) {
//     chrome.identity.getAuthToken({ interactive: true }, function (token) {
//       console.log("token:" + token);
//       let get_trash_email_arr = [];
//       get_trash_email_arr.push(getEmailPromise("/labels", "GET", token));
      
//       Promise.all(get_trash_email_arr).then((response) => {
//           responseArray = JSON.parse(response[0]);
//           console.log(responseArray);
//           // change_email_label_arr = [];
//           // responseArray = JSON.parse(response[0]);
//           // for (i = 0; i < responseArray.messages.length; i++) {
//           //     emailId = responseArray.messages[i].id
//           //     emailinfoarr.push(getEmailPromise(`/${emailId}/modify`, "POST", JSON.stringify({"addLabelIds": ["Label_5248497239207726318"]})));
//           // }
//       }).catch((error) => { console.error(error.message) });
//     });
//   }
// });


//     // accesses google api to get information about emails 
// function getEmailPromise(query, queryType, atoken) {
//       return new Promise((resolve, reject) => {
//           let Http = new XMLHttpRequest();
//           const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
//           Http.open(queryType, url);
//           Http.setRequestHeader("Content-Type", "application/json");
//           Http.setRequestHeader("Authorization", `Bearer ${atoken}`);
//           Http.send();

//           Http.onload = () => {
//               if (Http.status >= 200 && Http.status < 300) {
//                   resolve(Http.response);
//               } else {
//                   reject(Http.statusText);
//               }
//           };
//           Http.onerror = () => reject(Http.statusText);
//       })
//   };



// 

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

// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//   if (tab.url && tab.url.includes("mail.google.com/mail/u")) {
//     chrome.identity.getAuthToken({interactive: true}, function(token) {
//       console.log(token)
//        chrome.tabs.sendMessage(tabId, {
//          token: token
//        });
//    });
//   }
// });
