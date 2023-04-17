//// alex+lucy
var pageTokenlist = [];
var nomailDict = {};
var nomailLabels = ["sorte_keep", "sorte_delete", "sorte_keep_sent", "sorte trash", "sorte inbox"];
var prevtime = 0;
var currtime = 0;
var finishedWhile = 0;
var labelIdent = "";
var emails_to_sagemaker = [];
(() => {
    document.addEventListener("DOMContentLoaded", async function () {
        var btn = document.getElementById("upload-mail-button");
        var optionsBtn = document.getElementById("options");
        optionsBtn.addEventListener("click", openOptions);
        // function to run below
        // btn.addEventListener("click", sendEmailToDynamodb);
        btn.addEventListener("click", buttonSendDataSagemaker);
        //console.log("hello");
        //getLabelId("nomail_keep");
        //console.log(labelIdent);
        //getLabelEmailCount2('Label_8');
        var btn2 = document.getElementById("upload-mail-button-2");
        btn2.addEventListener("click", buttonSendData);

        var toggle = localStorage.getItem("button");
        if (toggle === null) {
            // default send to sagemaker
            localStorage.setItem("button", "send");
            btn2.style.display = 'none';
        } else {
            var send = toggle === "send" ? true : false;
            if (send) {
                btn2.style.display = 'none';
            } else {
                btn.style.display = 'none';
            }
        }
        // btn.addEventListener("click", messageTest);
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            checkNomailLabel(token);
            console.log("this is a test");
            //console.log(nomailDict["nomail_keep"]);
            //getLabelEmailCount2(token, nomailDict["nomail_keep"]);
        });

    });

    const buttonSendDataSagemaker = async () => {
        if (document.getElementById('img-icon').src != "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif") {
            const imgIcon = document.getElementById('img-icon');
            imgIcon.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif";
        } else {
            const imgIcon = document.getElementById('img-icon');
            imgIcon.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif";
        }
        sendEmailToSagemaker();
    }
    function openOptions() {
        window.location.href = "options.html";
    }

    const buttonSendData = async () => {
        console.log("clicked");
        if (document.getElementById('img-icon-2').src != "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif") {
            const imgIcon = document.getElementById('img-icon');
            imgIcon.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif";
        } else {
            const imgIcon = document.getElementById('img-icon-2');
            imgIcon.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Lightness_rotate_36f_cw.gif";
        }

        prevtime = Date.now();
        currtime = Date.now();
        while (finishedWhile != -1) {
            sendEmailToDynamodb()
            while (currtime >= prevtime) {
                console.log("in while loop");
                await new Promise(r => setTimeout(r, 3000));
            }
            await new Promise(r => setTimeout(r, 7000));
            let temp = currtime;
            currtime = prevtime;
            prevtime = temp;
        }
        document.getElementById('upload-mail-button').textContent = '';
        document.getElementById('img-icon-2').src = 'https://img.icons8.com/material-outlined/512/checked.png';
        setTimeout(function () {
            document.getElementById('img-icon-2').src = 'https://img.icons8.com/windows/512/upload.png';
        }, 3000);
        console.log("finished buttonWrapper");
        finishedWhile = 0;
    }
    const messageTest = async () => {
        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
            // modifyLabelsPromise("185ead977885b9f3",["nomail"],[""]);
            const response = await chrome.runtime.sendMessage({ greeting: "hello" });
            // do something with response here, not outside the function
            console.log(response);
        });

    }
    const testButtonFunction = () => {
        // chrome.identity.getAuthToken({interactive: true}, function(token) {
        //     //promisearr.push(getEmailPromise("/messages?maxResults=500", "GET", token));
        //     //getpagetokenlist(promisearr, token);
        //     //console.log(pageTokenlist);
        //     getMessageId(token);
        //     //getLabelId(token);
        //     //console.log(labelId);
        //     //testLabels(token);
        // });

        // create a new header element with loading id and text and append to header
        const headerElement = document.getElementByClassName('header');
        const newDiv = document.createElement('div');
        newDiv.id = 'loading';
        newDiv.textContent = 'loading';
        headerElement.appendChild(newDiv);

        // code to remove the loading div from the dom
        // will have to redefine newDiv in another function
        newDiv.parentNode.removeChild(newDiv);
    }

    // checks if nomail label exists. if not, adds label
    function checkNomailLabel(token) {
        let promiselist = [];
        promiselist.push(getEmailPromise("/labels", "GET", token));
        if (Object.keys(nomailDict).length != nomailLabels.length) {
            Promise.all(promiselist).then((response) => {
                response_json = JSON.parse(response[0]);
                for (let i = 0; i < response_json.labels.length; i += 1) {
                    if (nomailLabels.includes(response_json.labels[i].name)) {
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
            }).catch((error) => { console.error(error.message) }).then();
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
        body = JSON.stringify({ "addLabelIds": ["Label_8599665852067061281"] });
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
        body = JSON.stringify({
            "name": labelName,
            "messageListVisibility": "show",
            "labelListVisibility": "labelShow",
        });
        if (labelName === "sorte inbox") {
            body = JSON.stringify({
                "name": labelName,
                "messageListVisibility": "show",
                "labelListVisibility": "labelShow",
                "color": {
                    "textColor": "#ffffff",
                    "backgroundColor": "#a2dcc1"
                },
            });
        }
        if (labelName === "sorte trash") {
            body = JSON.stringify({
                "name": labelName,
                "messageListVisibility": "show",
                "labelListVisibility": "labelShow",
                "color": {
                    "textColor": "#ffffff",
                    "backgroundColor": "#ac2b16"
                },
            });
        }
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
        }).catch((error) => { console.error(error.message) }).then();
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
        }).catch((error) => { console.error(error.message) }).then();
    }
    // returns the label id of the label with the specified name. 
    function getLabelId(name1, name2, name3) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let promiseArr = [];
            let dict = {};
            promiseArr.push(listLabelId(token));
            Promise.all(promiseArr).then((response) => {
                let labelArr = JSON.parse(response[0])
                for (i = 0; i < labelArr.labels.length; i++) {
                    if (labelArr.labels[i].name === name1 || labelArr.labels[i].name === name2 || labelArr.labels[i].name === name3) {
                        //return labelArr.labels[i].id;
                        dict[labelArr.labels[i].name] = labelArr.labels[i].id;
                    }
                }
                if (dict.length == 0) {
                    throw new Error("Label not found");
                }
                return dict;
            }).then((response) => {

                labelIdent = response;
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
    const sendEmailToSagemaker = () => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let get_label_id_arr = [];
            get_label_id_arr.push(listLabelId(token));
            nomailDict = {};
            Promise.all(get_label_id_arr).then((response) => {
                if (Object.keys(nomailDict).length == nomailLabels.length) {
                    return nomailDict;
                }
                let labelArr = JSON.parse(response[0])
                for (i = 0; i < labelArr.labels.length; i++) {
                    if (nomailLabels.includes(labelArr.labels[i].name)) {
                        nomailDict[labelArr.labels[i].name] = labelArr.labels[i].id;
                    }
                }
                if (Object.keys(nomailDict).length == nomailLabels.length) {
                    return nomailDict;
                } else {
                    throw new Error("Label not found")
                };
            }).then((response) => {
                let get_email_arr = [];
                let daysOld = localStorage.getItem("days") || "3";
                let threshold = localStorage.getItem("threshold") || "100";
                //TODO need to get email promise to
                get_email_arr.push(
                    getEmailPromise(
                        `/messages?maxResults=${threshold}&q=in:inbox has:nouserlabels older_than:${daysOld}d`,
                        "GET",
                        token
                    )
                );
                return Promise.all(get_email_arr);
            }).then((response) => {
                get_email_info_arr = [];
                keepResponseArray = JSON.parse(response[0]);
                let keepLength = 0;
                if (keepResponseArray.messages) {
                    keepLength = keepResponseArray.messages.length;
                }
                // const loadingDiv = document.getElementById('loading');
                // loadingDiv.textContent = `Loading...${keepLength} emails`;
                console.log("response Array Length: ", keepResponseArray.messages.length);
                if (keepResponseArray.messages) {
                    for (i = 0; i < keepResponseArray.messages.length; i++) {
                        emailId = keepResponseArray.messages[i].id;
                        get_email_info_arr.push(
                            getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                        );
                    }
                }
                console.log("get_email_info_arr:", get_email_info_arr.length)
                emails_to_sagemaker = keepResponseArray.messages;
                return Promise.all(get_email_info_arr);
            })
                .then((response2) => {

                    jsons_to_sagemaker_arr = [];
                    for (i = 0; i < response2.length; i++) {
                        jsons_to_sagemaker_arr.push(getEmailJson(response2[i]));
                    }
                    return Promise.all(sendEmails(jsons_to_sagemaker_arr, "send_data_s3"));
                })
                .then((response3) => {
                    prevtime = Date.now();
                    console.log(response3);
                    console.log(JSON.parse(response3[0]));
                    for (i = 0; i < response3.length; i++) {
                        email_pred = JSON.parse(response3[i]);
                        console.log("email pred:", email_pred)
                        let email_pred_trash = [];
                        let email_pred_inbox = [];
                        for (n = 0; n < email_pred.length; n++) {
                            let email_id = emails_to_sagemaker[n + i * 25].id;
                            if (email_pred[n] == 1) {
                                email_pred_trash.push(email_id);

                            } else {
                                email_pred_inbox.push(email_id);

                            }
                        }
                        batchModifyLabels(email_pred_trash, [nomailDict["sorte trash"]], []);
                        batchModifyLabels(email_pred_inbox, [nomailDict["sorte inbox"]], []);
                    }
                    document.getElementById('img-icon').src = 'https://img.icons8.com/material-outlined/512/checked.png';
                    setTimeout(function () {
                        document.getElementById('img-icon').src = 'https://img.icons8.com/windows/512/upload.png';
                    }, 3000);

                })
                .catch((error) => {
                    // currtime = -1;
                    console.log("sendemails error");
                    console.error(error.message);
                });
        });
    };
    // main function loop that sends emails to dynamodb
    const sendEmailToDynamodb = () => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let get_label_id_arr = [];
            get_label_id_arr.push(listLabelId(token));
            nomailDict = {};
            Promise.all(get_label_id_arr).then((response) => {
                if (Object.keys(nomailDict).length == nomailLabels.length) {
                    return nomailDict;
                }
                let labelArr = JSON.parse(response[0])
                for (i = 0; i < labelArr.labels.length; i++) {
                    if (nomailLabels.includes(labelArr.labels[i].name)) {
                        nomailDict[labelArr.labels[i].name] = labelArr.labels[i].id;
                    }
                }
                if (Object.keys(nomailDict).length == nomailLabels.length) {
                    return nomailDict;
                } else {
                    throw new Error("Label not found")
                };
            }).then((response) => {
                let get_email_arr = [];
                get_email_arr.push(
                    getEmailPromise(
                        `/messages?maxResults=500&includeSpamTrash=true&q=in:inbox&labelIds=${nomailDict["sorte_keep"]}`,
                        "GET",
                        token
                    )
                );
                get_email_arr.push(
                    getEmailPromise(
                        `/messages?maxResults=500&includeSpamTrash=true&q=in:trash NOT label:sorte_delete`,
                        "GET",
                        token
                    )
                );
                return Promise.all(get_email_arr);
            }).then((response) => {
                get_email_info_arr = [];
                keepResponseArray = JSON.parse(response[0]);
                deleteResponseArray = JSON.parse(response[1]);
                let keepLength = 0;
                let deleteLength = 0;
                if (keepResponseArray.messages) {
                    keepLength = keepResponseArray.messages.length;
                }
                if (deleteResponseArray.messages) {
                    deleteLength = deleteResponseArray.messages.length;
                }
                console.log(" number of emails remaining", keepLength, deleteLength);
                const loadingDiv = document.getElementById('upload-mail-button');
                loadingDiv.textContent = `sending...${keepLength + deleteLength} emails`;

                if ((keepLength + deleteLength) < 25) {
                    console.log("finished this round");
                    finishedWhile = -1;
                }
                if (keepResponseArray.messages) {
                    for (i = 0; i < Math.min(25, keepLength); i++) {
                        emailId = keepResponseArray.messages[i].id;
                        modifyLabels(emailId, [nomailDict["sorte_keep_sent"]], [nomailDict["sorte_keep"]]);
                        get_email_info_arr.push(
                            getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                        );
                    }
                }
                const curr_emails = get_email_info_arr.length
                if (get_email_info_arr.length < 25) {
                    if (deleteResponseArray.messages) {
                        for (i = 0; i < Math.min(25 - curr_emails, deleteLength); i++) {
                            emailId = deleteResponseArray.messages[i].id;
                            modifyLabels(emailId, [nomailDict["sorte_delete"]], [])
                            get_email_info_arr.push(
                                getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                            );
                        }
                    }
                }

                console.log("get_email_info_arr:", get_email_info_arr.length)
                return Promise.all(get_email_info_arr);
            })
                .then((response2) => {
                    jsons_to_dynamodb_arr = [];
                    for (i = 0; i < response2.length; i++) {
                        jsons_to_dynamodb_arr.push(getEmailJson(response2[i]));
                    }
                    return Promise.all(sendEmails(jsons_to_dynamodb_arr, "send_data"));
                })
                .then((response3) => {
                    prevtime = Date.now();
                    console.log(response3);
                })
                .catch((error) => {
                    currtime = -1;
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
    function sendEmails(list, resource) {
        // iterates through every 25 emails and sends them to the backend
        let emailPromiseArr = [];
        for (let i = 0; i < list.length; i += 25) {
            let first_index = i;
            let last_index = Math.min(i + 25, list.length);
            let emailjsons = list.slice(first_index, last_index);
            emailPromiseArr.push(sendEmailPromise(emailjsons, resource));
        }
        return emailPromiseArr;
    }
    // creates a promise with max 25 emails and returns it
    function sendEmailPromise(emailjsons, resource) {
        return new Promise((resolve, reject) => {
            let Http = new XMLHttpRequest();
            const url =
                `https://rbx505a976.execute-api.us-east-1.amazonaws.com/prod/${resource}`;
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
                if (addedLabelIdArr.length == 0) {
                    addedLabelIdArr = null;
                }
                if (removedLabelIdArr.length == 0) {
                    removedLabelIdArr = null;
                }
                body = JSON.stringify({ "addLabelIds": addedLabelIdArr, "removeLabelIds": removedLabelIdArr });
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

    //todo add batch modify labels, 

    function batchModifyLabels(emailids, addedLabelIdArr, removedLabelIdArr) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let Http = new XMLHttpRequest();
            query = `/messages/batchModify`
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${token}`);
            if (removedLabelIdArr.length == 0) {
                body = JSON.stringify({ ids: emailids, "addLabelIds": addedLabelIdArr });
            } else {
                body = JSON.stringify({ ids: emailids, "addLabelIds": addedLabelIdArr, "removeLabelIds": removedLabelIdArr });
            }
            Http.send(body);
            // Http.onreadystatechange = async (e) => {
            //     if (Http.readyState == 4 && Http.status == 200) {
            //         response = JSON.parse(Http.response);
            //         console.log(response);
            //     }
            // }
        });
    }


    function modifyLabels(emailid, addedLabelIdArr, removedLabelIdArr) {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let Http = new XMLHttpRequest();
            query = `/messages/${emailid}/modify`
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${token}`);
            if (removedLabelIdArr.length == 0) {
                body = JSON.stringify({ "addLabelIds": addedLabelIdArr });
            } else {
                body = JSON.stringify({ "addLabelIds": addedLabelIdArr, "removeLabelIds": removedLabelIdArr });
            }
            Http.send(body);
            // Http.onreadystatechange = async (e) => {
            //     if (Http.readyState == 4 && Http.status == 200) {
            //         response = JSON.parse(Http.response);
            //         console.log(response);
            //     }
            // }
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