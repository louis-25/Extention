chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    

    window.addEventListener('dblclick', (e)=>{
        console.log('background ', e)
    })
    

    if (request.action === "FINISH")
        sendResponse({farewell: "goodbye"});
});