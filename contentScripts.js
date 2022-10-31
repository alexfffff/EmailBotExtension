//const { gmail } = require("googleapis/build/src/apis/gmail");
//const {google} = require('googleapis');


(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentEmail = "";
    let currentVideoBookmarks = [];
    let authToken = "";
    const Http = new XMLHttpRequest();
    function listMessages() {  
      const url='https://gmail.googleapis.com/gmail/v1/users/me/messages';
      Http.open("GET", url);
      Http.setRequestHeader("Content-Type", "application/json");
      Http.setRequestHeader("Authorization", `Bearer ${authToken}`)
      Http.send();
      Http.onreadystatechange=(e)=>{
      console.log(Http.responseText)
      }
    };
    function getName(){
      const url = ""
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