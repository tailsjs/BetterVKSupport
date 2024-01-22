console.log("oh, hi mark!")
console.log("module by tailsjs")

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes('support')) {
        injectScript(tabId);
    }
});

function injectScript(tabId) {
    chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['content.js'],
        }
    );

}