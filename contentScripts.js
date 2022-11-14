var trashList = [];

(() => {
    let authToken = "";

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
      }
    };

    


    function getEmailPromise(query, queryType, body) {
      return new Promise((resolve, reject) => {
        let Http = new XMLHttpRequest();
        const url='https://gmail.googleapis.com/gmail/v1/users/me' + query;
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
  

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { token} = obj;
      authToken = token;
      promisearr = [];
      //console.log(token);

      //get email info ${emailId}?format=minimal
      // listMessages("?maxResults=500&includeSpamTrash=true&q=in:trash")
      
      promisearr.push(getEmailPromise("/messages?maxResults=500&includeSpamTrash=true&q=in:trash", "GET", null));
      //promisearr.push(getEmailPromise("/labels", "GET", null));
      Promise.all(promisearr).then((response) => {
        // resonse will be an array of responses from the request
        emailinfoarr = [];
        response1 = JSON.parse(response[0]);
        // log the new 
        //response2 = JSON.parse(response[1]);
        //console.log(response2);
        for (i = 0; i < response1.messages.length; i++) {
          emailId = response1.messages[i].id;
          emailinfoarr.push(getEmailPromise(`/messages/${emailId}?format=minimal`, "GET", null));
          // add no mail label, remove trash label
          emailinfoarr.push(getEmailPromise(`/${emailId}/modify`, "POST", JSON.stringify({"addLabelIds": ["Label_5248497239207726318"]})));
        }
        Promise.all(emailinfoarr).then((response) => { 

          for (i = 0; i < response.length; i++) {
            response[i] = JSON.parse(response[i]);
            trashList.push(response[i].snippet);
          }
          console.log(trashList);
        }).catch((error) => {console.error(error.message)});
      }).catch((error) => {console.error(error.message)});

    });
})();