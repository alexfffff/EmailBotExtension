

//// alex+lucy
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('testButton');
        // function to run below
        btn.addEventListener('click', testLabels);
    });
    const testingLabels = () => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log("token:" + token);
            let get_trash_email_arr = [];
            get_trash_email_arr.push(getEmailPromise("/labels", "GET", token));
            
            Promise.all(get_trash_email_arr).then((response) => {
                responseArray = JSON.parse(response[0]);
                console.log(responseArray);
            }).catch((error) => { console.error(error.message) });
        });
    }


    // takes the first 500 emails in the trash and sends them to dynamodb
    const sendEmailToDynamodb = () => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log("token:" + token);
            let get_trash_email_arr = [];
            get_trash_email_arr.push(getEmailPromise("/messages?maxResults=500&includeSpamTrash=true&q=in:trash", "GET", token));
            Promise.all(get_trash_email_arr).then((response) => {
                get_email_info_arr = [];
                responseArray = JSON.parse(response[0]);
                for (i = 0; i < responseArray.messages.length; i++) {
                    emailId = responseArray.messages[i].id
                    get_email_info_arr.push(getEmailPromise(`/messages/${emailId}?format=full`, "GET", token));
                }

                Promise.all(get_email_info_arr).then((response2) => {
                    jsons_to_dynamodb_arr = [];
                    for (i = 0; i < response2.length; i++) {
                        jsons_to_dynamodb_arr.push(getEmailJson(response2[i]));
                    }


                    Promise.all(sendEmails(jsons_to_dynamodb_arr)).then((response3) => {
                        console.log(response3);
                    }).catch((error) => {
                        console.log("sendemails error")
                        console.error(error.message)});
                }).catch((error) => { console.error(error.message) });
            }).catch((error) => { console.error(error.message) });
        });
    }

    // takes in a gmail response and returns a json with the information we want
    function getEmailJson(email_response){
        email_response = JSON.parse(email_response);
        let body = "";
        if (email_response.payload.mimeType.startsWith('text/')) {
          body = email_response.payload.body.data;
        } else {
          body = email_response.payload.parts[0].body.data;
        }
        if (email_response.payload.mimeType.startsWith('multipart/')) {
          let partsVar = email_response.payload.parts[0];
          while (partsVar.hasOwnProperty('parts')) {
            body = partsVar.parts[0].body.data;
            partsVar = partsVar.parts[0];
          }
        }
        let emailid = email_response.id;
        let subject = "";
        let date = "";
        let receiver = "";
        let sender = "";
        let labels = email_response.labelIds.toString();
        let threadid = email_response.threadId;
        for (j = 0; j < email_response.payload.headers.length; j++) {
            if(email_response.payload.headers[j].name === "Subject") {
            subject = email_response.payload.headers[j].value;
            }
            if(email_response.payload.headers[j].name === "Date") {
            date = email_response.payload.headers[j].value;
            }
            if(email_response.payload.headers[j].name === "To") {
            receiver = email_response.payload.headers[j].value;
            }
            if(email_response.payload.headers[j].name === "From") {
            sender = email_response.payload.headers[j].value;
            }
        }
        return createEmailJson(emailid, body, subject, date, receiver, sender, labels, threadid);
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
    function getEmailPromise(query, queryType, atoken, body =null) {
        return new Promise((resolve, reject) => {
            let Http = new XMLHttpRequest();
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            Http.open(queryType, url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${atoken}`);
            Http.send(body);

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
    // senign request to backend 
    function testLabels() {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let Http = new XMLHttpRequest();
            query = "/messages/185c00c0bf580e9c/modify"
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${token}`);
            // Http.setRequestHeader("Access-Control-Allow-Origin", "*");
            // Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
            // Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
            body = JSON.stringify({"addLabelIds": ["Label_2"]});
            Http.send(body);
            Http.onreadystatechange = async (e) => {
                if (Http.readyState == 4 && Http.status == 200) {
                    response = JSON.parse(Http.response);
                    console.log(response);
                }
            }
        });
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

