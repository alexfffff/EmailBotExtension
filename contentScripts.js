//// alex+lucy
var pageTokenlist = [];
var nomailDict = {};
var nomailLabels = ["nomail_keep", "nomail_delete", "nomail_keep_sent"];
(() => {
    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("testButton");
        // function to run below
        btn.addEventListener("click", sendEmailToDynamodb);
        // btn.addEventListener("click", promiseWrapperTest);
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          checkNomailLabel(token);
        });
    });
    const promiseWrapperTest = () => {
        // modifyLabelsPromise("185ead977885b9f3",["nomail"],[""]);
        getLabelId("nomail");
    }
    const testButtonFunction = () => {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            //promisearr.push(getEmailPromise("/messages?maxResults=500", "GET", token));
            //getpagetokenlist(promisearr, token);
            //console.log(pageTokenlist);
            getMessageId(token);
            //getLabelId(token);
            //console.log(labelId);
            //testLabels(token);
        });
    }

    // checks if nomail label exists. if not, adds label
    function checkNomailLabel(token) {
      let promiselist = [];
      promiselist.push(getEmailPromise("/labels", "GET", token));
      if (nomailDict.length != nomailLabels.length) {
        Promise.all(promiselist).then((response) => {
            response_json = JSON.parse(response[0]);
            for (let i = 0; i < response_json.labels.length; i += 1) {
                if (response_json.labels[i].name in nomailLabels) {
                    nomailDict[response_json.labels[i].name] = response_json.labels[i].id;
                }
            }
            for (let i = 0; i < nomailLabels.length; i += 1) {
                if (nomailLabels[i] in nomailDict) {
                    continue;
                } else {
                    createLabel(token, nomailLabels[i]);
                }
            }
        }).catch((error) => {console.error(error.message)}).then();
      }
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

    function createLabel(token, labelName) {
      let Http = new XMLHttpRequest();
      const url = 'https://gmail.googleapis.com/gmail/v1/users/me/labels';
      Http.open("POST", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${token}`);
      body = JSON.stringify({"name": labelName,
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
    // returns the label id of the label with the specified name. 
    function getLabelId(name) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let promiseArr = [];
            promiseArr.push(listLabelId(token));
            Promise.all(promiseArr).then((response) => {
                let labelArr = JSON.parse(response[0])
                for (i = 0; i < labelArr.labels.length; i++) {
                    if (labelArr.labels[i].name === name) {
                        return labelArr.labels[i].id;
                    }
                }
                throw new Error("Label not found");
            }).then((response) => {


                console.log("getLabelID success");
                console.log(response);
                return response;
            }).catch((error) => {
                console.log("getLabelID error");
                console.error(error.message);
            });;
        });
    }

    // main function loop that sends emails to dynamodb
    const sendEmailToDynamodb = () => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log("token:" + token);
            let get_label_id_arr = [];
            get_label_id_arr.push(listLabelId(token));
            nomailDict = {};
            Promise.all(get_label_id_arr).then((response) => {
                    let labelArr = JSON.parse(response[0])
                    for (i = 0; i < labelArr.labels.length; i++) {
                        if (labelArr.labels[i].name in nomailLabels) {
                            nomailDict[labelArr.labels[i].name] = labelArr.labels[i].id;
                        }
                    }
                    console.log(nomailDict)
                    if (nomailDict.length == 3) {
                        return nomailDict;
                    } else {
                        throw new Error("Label not found")
                    };
                }).then((response) => {
                    let get_trash_email_arr = [];
                    get_trash_email_arr.push(
                        getEmailPromise(
                        "/messages?maxResults=500&includeSpamTrash=true&q=in:trash",
                        "GET",
                        token
                        )
                    );
                    return Promise.all(get_trash_email_arr);
                }).then((response) => {
                    get_email_info_arr = [];
                    responseArray = JSON.parse(response[0]);
                    for (i = 0; i < responseArray.messages.length; i++) {
                        emailId = responseArray.messages[i].id;
                        console.log(responseArray.messages[i])
                        get_email_info_arr.push(
                        getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                        );
                    }
                    return Promise.all(get_email_info_arr);
                })
                .then((response2) => {
                    jsons_to_dynamodb_arr = [];
                    for (i = 0; i < response2.length; i++) {
                        jsons_to_dynamodb_arr.push(getEmailJson(response2[i]));
                    }
                    return Promise.all(sendEmails(jsons_to_dynamodb_arr));
                })
                .then((response3) => {
                    console.log(response3);
                })
                .catch((error) => {
                    console.log("sendemails error");
                    console.error(error.message);
                });
        });
    };

    // takes in a gmail response and returns a json with the information we want
    function getEmailJson(email_response) {
        email_response = JSON.parse(email_response);
        let body = "";
        if (email_response.payload.mimeType.startsWith("text/")) {
        body = email_response.payload.body.data;
        } else {
        body = email_response.payload.parts[0].body.data;
        }
        if (email_response.payload.mimeType.startsWith("multipart/")) {
        let partsVar = email_response.payload.parts[0];
        while (partsVar.hasOwnProperty("parts")) {
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
        if (email_response.payload.headers[j].name === "Subject") {
            subject = email_response.payload.headers[j].value;
        }
        if (email_response.payload.headers[j].name === "Date") {
            date = email_response.payload.headers[j].value;
        }
        if (email_response.payload.headers[j].name === "To") {
            receiver = email_response.payload.headers[j].value;
        }
        if (email_response.payload.headers[j].name === "From") {
            sender = email_response.payload.headers[j].value;
        }
        }
        return createEmailJson(
        emailid,
        body,
        subject,
        date,
        receiver,
        sender,
        labels,
        threadid
        );
    }
    // creates an email object
    function createEmailJson(e, b, su, d, r, se, l, t) {
        return {
        emailuuid: e,
        body: b,
        subject: su,
        date: d,
        reciever: r,
        sender: se,
        labels: l,
        threadid: t,
        };
    }
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
        console.log(emailPromiseArr);
        return emailPromiseArr;
    }
    // creates a promise with max 25 emails and returns it
    function sendEmailPromise(emailjsons) {
        return new Promise((resolve, reject) => {
        let Http = new XMLHttpRequest();
        const url =
            "https://rbx505a976.execute-api.us-east-1.amazonaws.com/prod/send_data";
        Http.open("POST", url);
        Http.setRequestHeader("Content-Type", "application/json");
        let body = {
            emails: emailjsons,
        };

        Http.send(JSON.stringify(body));
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
    // adds the label to the emailid 
    function modifyLabelsPromise(emailid, addedLabelIdArr, removedLabelIdArr) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            return new Promise((resolve, reject) => {
                let Http = new XMLHttpRequest();
                query = `/messages/${emailid}/modify`
                const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
                Http.open("POST", url);
                Http.setRequestHeader("Content-Type", "application/json");
                Http.setRequestHeader("Authorization", `Bearer ${token}`);
                // Http.setRequestHeader("Access-Control-Allow-Origin", "*");
                // Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
                // Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
                body = JSON.stringify({"addLabelIds": addedLabelIdArr, "removeLabelIds": removedLabelIdArr});
                Http.send(body);
                Http.onreadystatechange = async (e) => {
                    if (Http.readyState == 4 && Http.status == 200) {
                        response = JSON.parse(Http.response);
                        console.log(response);
                    }
                }
            });
        });
    }
    // restursn arr of label objects
    function listLabelId(token) {
        return new Promise((resolve, reject) => {
            let Http = new XMLHttpRequest();
            query = `/labels`
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            Http.open("GET", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${token}`);
            // Http.setRequestHeader("Access-Control-Allow-Origin", "*");
            // Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
            // Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
            Http.send();
            Http.onload = async () => {
                if (Http.readyState == 4 && Http.status == 200) {
                    console.log(Http.response)
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

    // alex + lucy merge end
    // frontend start
    // egret's stuff
    const ce_main_container = document.createElement("DIV");
    const ce_name = document.createElement("DIV");

    ce_main_container.classList.add("testelement");
    ce_name.id = "ce_name";

    ce_name.innerHTML = `icon`;

    ce_main_container.appendChild(ce_name);

    const injectIconIntoContainer = (icon) => {
        // Recursively waits for the icon container to load and injects an
        // icon into it when it does

        let iconContainer = document.getElementsByClassName("G-Ni G-aE J-J5-Ji")[1];

        if (iconContainer !== undefined && iconContainer != null) {
        console.log("hi");
        iconContainer.appendChild(ce_main_container);
        } else {
        setTimeout(() => injectIconIntoContainer(icon), 200);
        }
    };
    // injectIconIntoContainer(ce_main_container);
})();
