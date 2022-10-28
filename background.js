// background.js

let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

// Listens for the "injectScraper" trigger from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.ping) {
    sendResponse({ pong: true });
    return;
  } else if (request.message === "injectScraper") {
    console.log("message received");
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    /^https\:\/\/mail\.google\.com\//.test(tab.url)
  ) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      activeTabID = tabs[0].id;

      chrome.tabs.sendMessage(activeTabID, { ping: true }, (response) => {
        if (response && response.pong) {
          // Content script is ready
          chrome.tabs.sendMessage(activeTabID, { message: "injectScraper" });
        } else {
          // No listener on the other end
          chrome.tabs.executeScript(
            activeTabID,
            { file: "./foreground.js" },
            () => {
              if (chrome.runtime.lastError) {
                throw Error("Unable to inject script into tab " + activeTabID);
              }

              // OK, now it's injected and ready
              chrome.tabs.sendMessage(activeTabID, {
                message: "injectScraper",
              });
            }
          );
        }
      });
    });

    chrome.scripting
      .insertCSS({
        target: { tabId: tabId },
        files: ["./foreground_styles.css"],
      })
      .then(() => {
        console.log("INJECTED THE FOREGROUND STYLES.");

        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"],
          })
          .then(() => {
            console.log("INJECTED THE FOREGROUND SCRIPT.");
          });
      })
      .catch((err) => console.log(err));
  }
});
