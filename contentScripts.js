

//// alex+lucy
var authToken = "";

(() => {

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('testButton');
        // function to run below
        btn.addEventListener('click', testButtonFunction);
    });
    const testButtonFunction = () => {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        let trashList = [];
        console.log("token: " + token);
        let promisearr = [];
        promisearr.push(getEmailPromise("/messages?maxResults=500&includeSpamTrash=true&q=in:trash", "GET", token));
        Promise.all(promisearr).then((response) => {
          emailinfoarr = [];
          responseArray = JSON.parse(response[0]);
          for (i = 0; i < responseArray.messages.length; i++) {
            emailId = responseArray.messages[i].id;
            emailinfoarr.push(getEmailPromise(`/messages/${emailId}?format=full`, "GET", token));
            //emailinfoarr.push(getEmailPromise(`/${emailId}/modify`, "POST", JSON.stringify({"addLabelIds": ["Label_5248497239207726318"]})));
          }
          Promise.all(emailinfoarr).then((response2) => {
            for (i = 0; i < response2.length; i++) {
              response2[i] = JSON.parse(response2[i]);
              // BODY
              let body = "";
              if (response2[i].payload.mimeType.startsWith('text/')) {
                body = response2[i].payload.body.data;
              } else {
                body = response2[i].payload.parts[0].body.data;
              }
              if (response2[i].payload.mimeType.startsWith('multipart/')) {
                let partsVar = response2[i].payload.parts[0];
                while (partsVar.hasOwnProperty('parts')) {
                  body = partsVar.parts[0].body.data;
                  partsVar = partsVar.parts[0];
                }
              }
              //console.log(response2[i].payload);
              let emailid = response2[i].id;
              let subject = "";
              let date = "";
              let receiver = "";
              let sender = "";
              let labels = response2[i].labelIds.toString();
              let threadid = response2[i].threadId;
              for (j = 0; j < response2[i].payload.headers.length; j++) {
                if(response2[i].payload.headers[j].name === "Subject") {
                  subject = response2[i].payload.headers[j].value;
                }
                if(response2[i].payload.headers[j].name === "Date") {
                  date = response2[i].payload.headers[j].value;
                }
                if(response2[i].payload.headers[j].name === "To") {
                  receiver = response2[i].payload.headers[j].value;
                }
                if(response2[i].payload.headers[j].name === "From") {
                  sender = response2[i].payload.headers[j].value;
                }
              }
              let emailJson = createEmailJson(emailid, body, subject, date, receiver, sender, labels, threadid);
              //console.log(emailJson);
              trashList.push(emailJson);
              //trashList.push(emailJson);
              //console.log(trashList);
            }
            //console.log(trashList[0]);
            Promise.all(sendEmails(trashList)).then((response3) => {
              console.log(response3);
            }).catch((error) => {
              console.log("sendemails error")
              console.error(error.message)});
          }).catch((error) => {console.error(error.message)});
        }).catch((error) => {console.error(error.message)});
     });
    }
    
    // creates an email object
    function createEmailJson(e, b, su, d, r, se, l, t) {
      return {
      "emailuuid": e,
      "body": b,
      "subject": su,
      "date": d,
      "reciever": r,
      "sender": se,
      "labels": l,
      "threadid": t
      };
    };
    // list takes in the full list of emails in the trash bin and returns a list of promises
    function sendEmails(list) {
        // iterates through every 25 emails and sends them to the backend
        let emailPromiseArr = [];
        for (let i = 0; i < list.length; i += 25) {
            let first_index = i;
            let last_index = Math.min(i + 25, list.length);
            let emailjsons = list.slice(first_index, last_index);
            emailPromiseArr.push(sendEmailPromise(emailjsons));
        }
        console.log(emailPromiseArr)
        return emailPromiseArr;

    }
    // creates a promise with max 25 emails and returns it
    function sendEmailPromise(emailjsons){
        return new Promise((resolve,reject) => {
            let Http = new XMLHttpRequest();
            const url='https://rbx505a976.execute-api.us-east-1.amazonaws.com/prod/send_data';
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            let body = {
                "emails": emailjsons
            }

            Http.send(JSON.stringify(body));
            Http.onload = () => {
                if (Http.status >= 200 && Http.status < 300) {
                    resolve(Http.response);
                } else {
                    reject(Http.statusText);
                }
            };
            Http.onerror = () => reject(Http.statusText);
        })
    }
    // accesses google api to get information about emails 
    function getEmailPromise(query, queryType, atoken) {
        return new Promise((resolve, reject) => {
            let Http = new XMLHttpRequest();
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
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
        })
    };

    function testDynamoDB() {
        let Http = new XMLHttpRequest();
        const url = 'https://rbx505a976.execute-api.us-east-1.amazonaws.com/prod/send_data';
        Http.open("POST", url);
        Http.setRequestHeader("Content-Type", "application/json");
        // Http.setRequestHeader("Access-Control-Allow-Origin", "*");
        // Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
        // Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
        Http.send();
        Http.onreadystatechange = async (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                response = JSON.parse(Http.response);
                console.log(response);
            }
        }
    }

    // alex + lucy merge end
    // frontend start
    // egret's stuff
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
  // injectIconIntoContainer(ce_main_container);

})();


        //  });

// testing code 
    // chrome.identity.getAuthToken({interactive: true}, function(token) {
    //     console.log("token: " + token);
    //   authToken = token;
    //   let promisearr = [];
    //   promisearr.push(getEmailPromise("/messages?maxResults=500&includeSpamTrash=true&q=in:trash", "GET", null));
    //   //promisearr.push(getEmailPromise("/labels", "GET", null));
    //   Promise.all(promisearr).then((response) => {
    //     // resonse will be an array of responses from the request
    //     emailinfoarr = [];
    //     response1 = JSON.parse(response[0]);
    //     // log the new 
    //     //response2 = JSON.parse(response[1]);
    //     //console.log(response2);
    //     for (i = 0; i < response1.messages.length; i++) {
    //       emailId = response1.messages[i].id;
    //       emailinfoarr.push(getEmailPromise(`/messages/${emailId}?format=minimal`, "GET", null));
    //       // add no mail label, remove trash label
    //     }
    //     Promise.all(emailinfoarr).then((response) => { 

    //       for (i = 0; i < response.length; i++) {
    //         response[i] = JSON.parse(response[i]);
    //         trashList.push(response[i].snippet);
    //       }
    //       console.log(trashList);
    //     }).catch((error) => {console.error(error.message)});
    //   }).catch((error) => {console.error(error.message)});
    // });

//   const testButtonFunction = () => {
//     emailjsons = [
//         {
//             "emailuuid": "slfjkaklsdjfls",
//             "body": "first body",
//             "subject": "first subject",
//             "date": "date",
//             "reciever": "alexdong@gmail.com",
//             "sender": "lucy@gmail.com", 
//             "read": true
//         },
//         {
//             "emailuuid": "sfdssjjjjjj",
//             "body" : "second body",
//             "subject": "second subject",
//             "date": "date",
//             "reciever": "alexdong@gmail.com",
//             "sender": "lucy@gmail.com", 
//             "read": false
//         }
//     ];
//     Promise.all(sendEmails(emailjsons)).then((response) => {
//         console.log(response);
//     }).catch((error) => {console.error(error)});
//     // chrome.identity.getAuthToken({interactive: true}, function(token) {
//     //     console.log("token: " + token);

//     //  });

// }