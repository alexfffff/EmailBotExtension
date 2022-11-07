var trashList = [];

(() => {
    let authToken = "";

    function listMessages(query ) {  
      let Http = new XMLHttpRequest();
      const url='https://gmail.googleapis.com/gmail/v1/users/me/messages' + query;
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
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
    function getEmailPromise(query,body = null) {
      return new Promise((resolve, reject) => {
        let Http = new XMLHttpRequest();
        const url='https://gmail.googleapis.com/gmail/v1/users/me/messages' + query;
        Http.open("GET", url);
        Http.setRequestHeader("Content-Type", "application/json");
        Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
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
      //get email info ${emailId}?format=minimal
      // listMessages("?maxResults=500&includeSpamTrash=true&q=in:trash")
      
      promisearr.push(getEmailPromise("?maxResults=500&includeSpamTrash=true&q=in:trash"));
      Promise.all(promisearr).then((response) => {
        // resonse will be an array of responses from the request
        emailinfoarr = [];
        response1 = JSON.parse(response[0]);
        for (i = 0; i < response1.messages.length; i++) {
          emailId = response1.messages[i].id;
          emailinfoarr.push(getEmailPromise(`/${emailId}?format=minimal`));
        }
        Promise.all(emailinfoarr).then((response) => { 

          for (i = 0; i < response.length; i++) {
            response[i] = JSON.parse(response[i]);
            trashList.push(response[i].snippet);
          }
          console.log(trashList);
        });
      });

    });
})();