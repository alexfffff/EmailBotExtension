chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("received message");
        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
            query = `/labels`
            const url = 'https://gmail.googleapis.com/gmail/v1/users/me' + query;

            let fetchRes = fetch(url,{
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            let fetchRes2 = fetch(url,{
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
                // fetchRes is the promise to resolve
                // it by using.then() method
            // fetchRes.then(function (response) {
            //     response.json().then(d => {
            //         console.log(d);
            //     })
            // });
            await Promise.all([fetchRes,fetchRes2]).then(async function (values) {
                console.log("1")
                let d = await values[0].json();
                console.log(d)
                console.log("3")
                let d2 = await values[1].json();
                console.log(d2)
                console.log("5")
            });

        });
    }
);