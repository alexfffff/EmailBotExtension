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

var number = 0;
var number2 = 0;
var number3 = 0;

document.addEventListener("DOMContentLoaded", async function () {
  console.log("hi");

  var emailAddress = document.getElementById("email-address");
  var toReviewNum = document.getElementById("review-email-num");
  var detectedNum = document.getElementById("detected-email-num");
  var deletedNum = document.getElementById("tbd-email-num");

  chrome.identity.getAuthToken({ interactive: true }, async function (token) {
    //const email_ids = await getLabelId("nomail_keep", "nomail_delete", "nomail_inbox");

    //console.log(email_ids);
    
    const email = await getEmailPromise("/profile", "GET", token);
    emailAddress.innerText = JSON.parse(email)["emailAddress"];

    //checkNomailLabel(token);
  });

  const number_dummy = await getLabelEmailCount2("nomail_inbox", "nomail_trash");
  await new Promise(r => setTimeout(r, 2000));
  console.log("number: " + number);
  toReviewNum.innerText = number + number2;
  detectedNum.innerText = number2;
  deletedNum.innerText = number3 - number - number2;
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

// this is also from contentscripts.js
// wasn't running when this wasn't in this file
function getLabelEmailCount2(labelId, labelId2) {//}= async (authToken, labelId) => {
  //await new Promise(r => setTimeout(r, 20000));
  console.log("test_1");
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
      let promiselist = [];
      promiselist.push(listLabelId(token));
      nomailDict = {};
      Promise.all(promiselist).then((response) => {
          if (Object.keys(nomailDict).length == nomailLabels.length) {
              return nomailDict;
          }
          let labelArr = JSON.parse(response[0])
          for (i = 0; i < labelArr.labels.length; i++) {
              if (nomailLabels.includes(labelArr.labels[i].name)) {
                  nomailDict[labelArr.labels[i].name] = labelArr.labels[i].id;
              }
          }
          console.log("1111111111");
          if (Object.keys(nomailDict).length == nomailLabels.length) {
              return nomailDict;
          } else {
              throw new Error("Label not found")
          };
      }).then((response) => {
          console.log("this is a test here0");
          let promiselist2 = [];
          promiselist2.push(getEmailPromise(`/labels/${nomailDict[labelId]}`, "GET", token));
          return Promise.all(promiselist2);
          }).then((response) => {
              console.log("this is a test here");
              response_json = JSON.parse(response[0]);
              console.log("Emails in nomail_inbox: " + response_json.messagesTotal);
              number = response_json.messagesTotal;
              //return response_json.messagesTotal;

              let promiselist3 = [];
              promiselist3.push(getEmailPromise(`/labels/${nomailDict[labelId2]}`, "GET", token));
              return Promise.all(promiselist3);
          }).then((response) => {
              console.log("this is a test here 2");
              response_json = JSON.parse(response[0]);
              console.log("Emails in nomail_trash: " + response_json.messagesTotal);
              number2 = response_json.messagesTotal;
              //return response_json.messagesTotal;

              let promiselist4 = [];
              promiselist4.push(getEmailPromise(`/labels/INBOX`, "GET", token));
              return Promise.all(promiselist4);
          }).then((response) => {
              console.log("this is a test here 3");
              response_json = JSON.parse(response[0]);
              console.log("Emails in inbox: " + response_json.messagesTotal);
              number3 = response_json.messagesTotal;
              return response_json.messagesTotal;
          })
          .catch((error) => {
              console.error(error.message);
          });
  //});
  });
}

// also copied directly from contentscripts.js
function listLabelId(token) {
  return new Promise((resolve, reject) => {
      let Http = new XMLHttpRequest();
      query = `/labels`
      const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${token}`);
      Http.send();
      Http.onload = async () => {
          if (Http.readyState == 4 && Http.status == 200) {
              // check if response is undefined
              resolve(Http.response);

          } else {
              console.log("shouldn't see this")
              reject(Http.statusText);
          }
      };
      Http.onerror = () => reject(Http.statusText);
  });
}