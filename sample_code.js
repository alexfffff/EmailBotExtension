const testButtonFunction = () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log("token: " + token);
    let promisearr = [];
    promisearr.push(
      getEmailPromise(
        "/messages?maxResults=500&includeSpamTrash=true&q=in:trash",
        "GET",
        token
      )
    );
    Promise.all(promisearr)
      .then((response) => {
        emailinfoarr = [];
        responseArray = JSON.parse(response[0]);
        for (i = 0; i < responseArray.messages.length; i++) {
          emailId = responseArray.messages[i].id;
          emailinfoarr.push(
            getEmailPromise(`/messages/${emailId}?format=full`, "GET", token)
          );
          //emailinfoarr.push(getEmailPromise(`/${emailId}/modify`, "POST", JSON.stringify({"addLabelIds": ["Label_5248497239207726318"]})));
        }
        Promise.all(emailinfoarr)
          .then((response2) => {
            for (i = 0; i < response2.length; i++) {
              response2[i] = JSON.parse(response2[i]);
              // BODY
              let body = response2[i].payload.parts[0].body.data;
              let emailid = response2[i].id;
              let subject = "";
              let date = "";
              let receiver = "";
              let sender = "";
              let labels = response2[i].labelIds.toString();
              let threadid = response2[i].threadId;
              for (j = 0; j < response2[i].payload.headers.length; j++) {
                if (response2[i].payload.headers[j].name === "Subject") {
                  subject = response2[i].payload.headers[j].value;
                }
                if (response2[i].payload.headers[j].name === "Date") {
                  date = response2[i].payload.headers[j].value;
                }
                if (response2[i].payload.headers[j].name === "To") {
                  receiver = response2[i].payload.headers[j].value;
                }
                if (response2[i].payload.headers[j].name === "From") {
                  sender = response2[i].payload.headers[j].value;
                }
              }
              let emailJson = createEmailJson(
                emailid,
                body,
                subject,
                date,
                receiver,
                sender,
                labels,
                threadid
              );
              trashList.push(emailJson);
            }
            console.log(trashList[0]);
            Promise.all(sendEmails(trashList))
              .then((response3) => {
                console.log(response3);
              })
              .catch((error) => {
                console.log("sendemails error");
                console.error(error.message);
              });
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  });
};

// testing code
chrome.identity.getAuthToken({ interactive: true }, function (token) {
  console.log("token: " + token);
  authToken = token;
  let promisearr = [];
  promisearr.push(
    getEmailPromise(
      "/messages?maxResults=500&includeSpamTrash=true&q=in:trash",
      "GET",
      null
    )
  );
  //promisearr.push(getEmailPromise("/labels", "GET", null));
  Promise.all(promisearr)
    .then((response) => {
      // resonse will be an array of responses from the request
      emailinfoarr = [];
      response1 = JSON.parse(response[0]);
      // log the new
      //response2 = JSON.parse(response[1]);
      //console.log(response2);
      for (i = 0; i < response1.messages.length; i++) {
        emailId = response1.messages[i].id;
        emailinfoarr.push(
          getEmailPromise(`/messages/${emailId}?format=minimal`, "GET", null)
        );
        // add no mail label, remove trash label
      }
      Promise.all(emailinfoarr)
        .then((response) => {
          for (i = 0; i < response.length; i++) {
            response[i] = JSON.parse(response[i]);
            trashList.push(response[i].snippet);
          }
          console.log(trashList);
        })
        .catch((error) => {
          console.error(error.message);
        });
    })
    .catch((error) => {
      console.error(error.message);
    });
});

const testButtonFunction1 = () => {
  emailjsons = [
    {
      emailuuid: "slfjkaklsdjfls",
      body: "first body",
      subject: "first subject",
      date: "date",
      reciever: "alexdong@gmail.com",
      sender: "lucy@gmail.com",
      read: true,
    },
    {
      emailuuid: "sfdssjjjjjj",
      body: "second body",
      subject: "second subject",
      date: "date",
      reciever: "alexdong@gmail.com",
      sender: "lucy@gmail.com",
      read: false,
    },
  ];
  Promise.all(sendEmails(emailjsons))
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
  // chrome.identity.getAuthToken({interactive: true}, function(token) {
  //     console.log("token: " + token);

  //  });
};
