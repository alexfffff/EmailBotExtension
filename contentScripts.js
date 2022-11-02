//const { gmail } = require("googleapis/build/src/apis/gmail");
//const {google} = require('googleapis');


(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentEmail = "";
    let currentVideoBookmarks = [];
    let authToken = "";
    let Http = new XMLHttpRequest();
    function listMessages() {  
      const url='https://gmail.googleapis.com/gmail/v1/users/me/messages';
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
      Http.send();
      Http.onreadystatechange=(e)=>{
        //create for loop in the response 
        //for each message in the response, get the message id
        //then call getEmailInfo with the message id
        console.log(Http.responseText);
        let response = JSON.parse(Http.responseText)
        for (let i = 0; i < response.messages.length; i++) {
          getEmailInfo(response.messages, i);
        }
      }
    };

    const getEmailInfo = async(response_messages, i)=> {
      emailId = response_messages[i].id;
      console.log(emailId)
      Http = new XMLHttpRequest();
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=minimal`;
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
      Http.send();
      Http.onreadystatechange=(e)=>{
        console.log(Http.responseText)
      }
    }

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { token} = obj;
      authToken = token;
      listMessages()
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