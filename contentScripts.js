

//// alex+lucy
var pageTokenlist = [];
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('testButton');
        // function to run below
        btn.addEventListener('click', testButtonFunction);
    });
    const testButtonFunction = () => {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            let promisearr = [];
            promisearr.push(getEmailPromise("/messages?maxResults=500", "GET", token));
            getpagetokenlist(promisearr, token);
            console.log(pageTokenlist);
        });
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

