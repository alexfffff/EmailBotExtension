//// alex+lucy
var trashList = [];

(() => {
    let authToken = "";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { token} = obj;
      authToken = token;
      promisearr = [];
      console.log("testing")
      testDynamoDB();

      //get email info ${emailId}?format=minimal
      // listMessages("?maxResults=500&includeSpamTrash=true&q=in:trash")
      // promisearr.push(getEmailPromise("/messages?maxResults=500&includeSpamTrash=true&q=in:trash", "GET", null));
      // //promisearr.push(getEmailPromise("/labels", "GET", null));
      // Promise.all(promisearr).then((response) => {
      //   // resonse will be an array of responses from the request
      //   emailinfoarr = [];
      //   response1 = JSON.parse(response[0]);
      //   // log the new 
      //   //response2 = JSON.parse(response[1]);
      //   //console.log(response2);
      //   for (i = 0; i < response1.messages.length; i++) {
      //     emailId = response1.messages[i].id;
      //     emailinfoarr.push(getEmailPromise(`/messages/${emailId}?format=minimal`, "GET", null));
      //     // add no mail label, remove trash label
      //     emailinfoarr.push(getEmailPromise(`/${emailId}/modify`, "POST", JSON.stringify({"addLabelIds": ["Label_5248497239207726318"]})));
      //   }
      //   Promise.all(emailinfoarr).then((response) => { 

      //     for (i = 0; i < response.length; i++) {
      //       response[i] = JSON.parse(response[i]);
      //       trashList.push(response[i].snippet);
      //     }
      //     console.log(trashList);
      //   }).catch((error) => {console.error(error.message)});
      // }).catch((error) => {console.error(error.message)});
    });

    function listMessages(query) {  
      let Http = new XMLHttpRequest();
      const url='https://gmail.googleapis.com/gmail/v1/users/me/messages' + query;
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`);
      Http.send();
      Http.onreadystatechange=async (e)=>{
          if (Http.readyState == 4 && Http.status == 200) {
            response = JSON.parse(Http.response);
            var promisearr = [];
            var requestlist = [], i;
            for (i = 0; i < response.messages.length; i++) {
              emailId = response.messages[i].id;
              getEmailInfo(emailId,i,requestlist);
            }
        }
    }};
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



    function getEmailPromise(query, queryType, body) {
        return new Promise((resolve, reject) => {
            let Http = new XMLHttpRequest();
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;
            //const url='https://gmail.googleapis.com/gmail/v1/users/me/labels' + query;
            Http.open(queryType, url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.setRequestHeader("Authorization", `Bearer ${authToken}`);
            //Http.setRequestHeader("Access-Control-Allow-Origin", "*");
            //Http.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, X-Auth-Token");
            //Http.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
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

    // alex + lucy merge end
    // frontend start

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

  // needed functions for frontend //

  // options page
  /* > get thresholds
  * > toggle auto deletion
  * > change default nomail label to a custom one 
  *   (just pick from preexisting labels)
  *   will need functions to retrieve existing labels as well as set the default label to nomail spam
  * > get nomail marked spam from certain dates for metrics
  * > get total nomails deleted
  * > get total spamn identified
  * > get total false detected emails
  * > get total emails to be reviewed (emails in nomail label)
  * 
  */
})();




/**********************/
// TEST FUNCTIONS HERE //
/**********************/
// button is located in the popup


document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('testButton');
    // function to run below
    btn.addEventListener('click', myFunction);
});

const myFunction = () => {
    console.log("test");
}