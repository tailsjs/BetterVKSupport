console.log("oh, hi mark!")
console.log("extension by tailsjs")

let extensionData = null

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes('vk.com/support')) {
        injectScript(tabId);
    }
});

function injectScript(tabId) {
    chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ['content.js']
        }
    );
}

getExtensionData()

function getExtensionData() {
    fetch('https://raw.githubusercontent.com/tailsjs/BetterVKSupport/database/data.json')
    .then(response => response.json())
    .then(data => {
        chrome.storage.local.set({ BetterVKSupportData: data });
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}
