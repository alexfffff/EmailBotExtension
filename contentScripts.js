//const { gmail } = require("googleapis/build/src/apis/gmail");
//const {google} = require('googleapis');
var trashList = [];

(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentEmail = "";
    let currentVideoBookmarks = [];
    let authToken = "";
    let Http = new XMLHttpRequest();
    /*function listMessages() {  
      const url='https://gmail.googleapis.com/gmail/v1/users/me/messages';
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
      Http.send();
      Http.onreadystatechange=async (e)=>{
        //create for loop in the response 
        //for each message in the response, get the message id
        //then call getEmailInfo with the message id
        // if e is undefined, then the response is not ready
        if(Http.response === ""){
          return;
        } else {
          response = JSON.parse(Http.response);
          var requestlist = [], i;
          for (i = 0; i < response.messages.length; i++) {
            emailId = response.messages[i].id;
            (function(emailId,i){
              console.log(emailId)
              requestlist[i] = new XMLHttpRequest();
              const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=minimal`;
              requestlist[i].open("GET", url);
              requestlist[i].setRequestHeader("Content-Type", "application/json");
              requestlist[i].setRequestHeader("Authorization", `Bearer ${authToken}`)
              requestlist[i].send();
              requestlist[i].onreadystatechange=(e)=>{
                if (requestlist[i].readyState == 4 && requestlist[i].status == 200) {
                  if(requestlist[i].response !== ""){
                    console.log(requestlist[i].responseText)
                  }
               }
              }
            })(emailId,i);
          }
        }
      }
    };*/

    function listTrashMessages() {  
      const url=`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&includeSpamTrash=true&q=in:trash`;
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
      Http.send();
      Http.onreadystatechange=(e)=>{
        //create for loop in the response 
        //for each message in the response, get the message id
        //then call getEmailInfo with the message id
        console.log(Http.responseText);
        let response = JSON.parse(Http.responseText);
        for (let i = 0; i < response.messages.length; i++) {
          trashList.push(response_messages[i].id);
        }
      }
    };


    const getEmailInfo = async(emailId, i)=> {
      console.log(emailId)
      requestlist[i] = new XMLHttpRequest();
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=minimal`;
      requestlist[i].open("GET", url);
      requestlist[i].setRequestHeader("Content-Type", "application/json");
      requestlist[i].setRequestHeader("Authorization", `Bearer ${authToken}`)
      requestlist[i].send();
      requestlist[i].onreadystatechange=(e)=>{
        console.log(requestlist[i].responseText)
      }
    }
  

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { token} = obj;
      authToken = token;
      //listMessages()
    });
})();


/*functionlistMessages(auth, query) {  
  return new Promise((resolve, reject) => {    
    const gmail = google.gmail({version: 'v1', auth});    
    gmail.users.messages.list(      
      {        
        userId: 'me',        
        q: query,      
      },            (err, res) => {        
        if (err) {                    reject(err);          
          return;        
        }        
        if (!res.data.messages) {                    resolve([]);          
          return;        
        }                resolve(res.data.messages);      
      }    
    );  
  })
;}*/

// const messages = await listMessages(oAuth2Client, 'label:inbox subject:reminder');