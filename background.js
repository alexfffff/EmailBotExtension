
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log("received message");
//         chrome.identity.getAuthToken({ interactive: true }, async function (token) {
//             query = `/labels`
//             const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;

//             let fetchRes = fetch(url,{
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });
//             let fetchRes2 = fetch(url,{
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });
//                 // fetchRes is the promise to resolve
//                 // it by using.then() method
//             // fetchRes.then(function (response) {
//             //     response.json().then(d => {
//             //         console.log(d);
//             //     })
//             // });
//             await Promise.all([fetchRes,fetchRes2]).then(async function (values) {
//                 console.log("1")
//                 let d = await values[0].json();
//                 console.log(d)
//                 console.log("3")
//                 let d2 = await values[1].json();
//                 console.log(d2)
//                 console.log("5")
//             });

//         });
//     }

// );

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "hello") {
            console.log("hello was received");
        }
        console.log("received message");
        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
            let get_label_id_arr = [];
            get_label_id_arr.push(listLabelId(token));
            nomailDict = {};
            query = `/labels`
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;

            let fetchRes = fetch(url,{
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log("This is a test from background");

            await Promise.all([fetchRes]).then(async function (values) {
                if (Object.keys(nomailDict).length == nomailLabels.length) {
                    return nomailDict;
                }
                let labelArr = JSON.parse(values[0]);
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
            }).then(async function (values2) {
                const url2 = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&includeSpamTrash=true&q=in:inbox&labelIds=${nomailDict["nomail_keep"]}`;
                let fetchRes2 = fetch(url2,{
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                return fetchRes2;
            }).then(async function (values3) {
                console.log(values3);
            });

        });
    }

);
// main function loop that sends emails to dynamodb
/*const sendEmailToDynamodb = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        Promise.all(get_label_id_arr).then((response) => {
            }).then((response) => {
                let get_email_arr = [];
                get_email_arr.push(
                    getEmailPromise(
                    `/messages?maxResults=500&includeSpamTrash=true&q=in:inbox&labelIds=${nomailDict["nomail_keep"]}`,
                    "GET",
                    token
                    )
                );
                get_email_arr.push(
                    getEmailPromise(
                        `/messages?maxResults=500&includeSpamTrash=true&q=in:trash has:nouserlabels`,
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
                console.log(" number of emails remaining", keepLength + deleteLength);
                if ((keepLength + deleteLength) < 25) {
                    console.log("finished this round");
                    finishedWhile = -1;
                } 
                if (keepResponseArray.messages){
                    for (i = 0; i < Math.min(25,keepLength); i++) {
                        emailId = keepResponseArray.messages[i].id;
                        modifyLabels(emailId,[nomailDict["nomail_keep_sent"]], [nomailDict["nomail_keep"]]);
                        get_email_info_arr.push(
                        getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                        );
                    }
                }   
                if (deleteResponseArray.messages) {
                    for (i = 0; i < Math.min(25,deleteLength); i++) {
                        emailId = deleteResponseArray.messages[i].id;
                        modifyLabels(emailId,[nomailDict["nomail_delete"]], [])
                        get_email_info_arr.push(
                        getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
                        );
                    }
                }
                console.log("get_email_info_arr:",get_email_info_arr.length)
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
                prevtime = Date.now();
                console.log(response3);
            })
            .catch((error) => {
                currtime = -1;
                console.log("sendemails error");
                console.error(error.message);
            });
    });
};*/