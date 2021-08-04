chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.addEventListener('dblclick', (e)=>{
        console.log('background ', e)
    })
    console.log('backend ',request)
    
    if (request.action === "FINISH")
        sendResponse({farewell: "goodbye"});
});