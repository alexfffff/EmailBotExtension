

//// alex+lucy
var pageTokenlist = [];
var labelId = "";
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('testButton');
        // function to run below
        btn.addEventListener('click', testButtonFunction);
    });
    const testButtonFunction = () => {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            //promisearr.push(getEmailPromise("/messages?maxResults=500", "GET", token));
            //getpagetokenlist(promisearr, token);
            //console.log(pageTokenlist);
            getMessageId(token);
            //getLabelId(token);
            //console.log(labelId);
            //testLabels(token);
            //createLabel(token);
        });
    }

    // checks if nomail label exists. if not, adds label
    function checkNomailLabel(token) {
      let promiselist = [];
      promiselist.push(getEmailPromise("/labels", "GET", token));

      Promise.all(promiselist).then((response) => {
        response_json = JSON.parse(response[0]);
        for (let i = 0; i < response_json.labels.length; i += 1) {
          if (response_json.labels[i].name == "nomail") {
            labelId = response_json.labels[i].id;
          }
        }
        if (labelId == "") {
          createLabel(token);
        }
      }).catch((error) => {console.error(error.message)}).then();
    }

    function testLabels(token) {
      let Http = new XMLHttpRequest();
      query = "/messages/185ea543e8b85742/modify"
      const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
      Http.open("POST", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${token}`);
      // Http.setRequestHeader("Access-Control-Allow-Origin", "*");
      // Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
      // Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
      body = JSON.stringify({"addLabelIds": ["Label_8599665852067061281"]});
      Http.send(body);
      Http.onreadystatechange = async (e) => {
          if (Http.readyState == 4 && Http.status == 200) {
              response = JSON.parse(Http.response);
              console.log(response);
          }
      }
    }

    function createLabel(token) {
      let Http = new XMLHttpRequest();
      const url = 'https://gmail.googleapis.com/gmail/v1/users/me/labels';
      Http.open("POST", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${token}`);
      body = JSON.stringify({"name": "nomail",
                              "messageListVisibility": "show",
                              "labelListVisibility": "labelShow",
                            });
      Http.send(body);
      Http.onreadystatechange = async (e) => {
          if (Http.readyState == 4 && Http.status == 200) {
              response = JSON.parse(Http.response);
              console.log(response);
          }
      }
    }

    // Retrieves message id of first 10 emails in inbox
    function getMessageId(authToken) {
      let promiselist = [];
      promiselist.push(getEmailPromise("/messages?maxResults=10&q=in:inbox", "GET", authToken));

      Promise.all(promiselist).then((response) => {
        response_json = JSON.parse(response[0]);
        console.log(response_json);
        for (let i = 0; i < response_json.messages.length; i += 1) {
          console.log(response_json.messages[i].id);
        }
    }).catch((error) => {console.error(error.message)}).then();
    }

    // gets label id from label name
    function getLabelId(authToken) {
      let promiselist = [];
      promiselist.push(getEmailPromise("/labels", "GET", authToken));

      Promise.all(promiselist).then((response) => {
        response_json = JSON.parse(response[0]);
        for (let i = 0; i < response_json.labels.length; i += 1) {
          if (response_json.labels[i].name == "nomail") {
            labelId = response_json.labels[i].id;
          }
        }
    }).catch((error) => {console.error(error.message)}).then();
    }

    function getpagetokenlist(promiselist, authToken) { 
        Promise.all(promiselist).then((response) => {
            response_json = JSON.parse(response[0]);
            // check if response_json has nextPageToken
            if (response_json.nextPageToken) {
                pageTokenlist.push(response_json.nextPageToken);
                if (pageTokenlist < 10) {
                    temp_arr = []
                    temp_arr.push(getEmailPromise(`/messages?maxResults=500&pageToken=${response_json.nextPageToken}`, "GET", authToken));
                    getpagetokenlist(promiselist, authToken);
                }

            }
        }).catch((error) => {console.error(error.message)}).then();
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

