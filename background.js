chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: copyClickupTitle
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "run-script") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: copyClickupTitle
                });
            }
        });
    }
});

function copyClickupTitle() {
    // document.querySelector("#app-root > cu-app-view > cu-task-keeper > cu-task-view > div > div > div > cu-task-view-body > div > cu-task-view-task-content >
    //  div.cdk-virtual-scrollable.cu-task-view-task-content__scrollable.ng-tns-c1455730629-8.ng-star-inserted > div.cu-task-view-task-content__body.ng-tns-c1455730629-8 >
    //  cu-task-hero-section > div.cu-task-hero-section__actions.ng-tns-c1845752313-9.ng-star-inserted > cu-task-view-task-label > cu-task-id-button > button")
    let selector = "cu-task-view-task-label cu-task-id-button button"

    function takeId() {
        let button = document.querySelector(selector)
        if (!button) {
            console.error("No button found");
            return;
        }

        let ariaLabel = button.getAttribute("aria-label");
        if (ariaLabel === undefined) {
            console.error("No aria-label found");
            return;
        }

        ariaLabel = ariaLabel.replace("Copy Task ID ", "");
        return ariaLabel;
    }


    if (window.location.href.indexOf("clickup.com") === -1) {
        return;
    }

    let h1 = document.querySelector("div.cu-task-title__text-wrapper > h1")
    if (!h1) {
        console.error("No title found");
        return;
    }
    
    let url = window.location.href;
    let title = h1.innerText;
    let id = takeId();

    const content = `<a href="${url}">[${id}]</a> ${title}`;
    let temp = document.createElement('div');
    temp.innerHTML = content;

    const blobHtml = new Blob([content], { type: 'text/html' });
    const blobText = new Blob([temp.innerText], { type: 'text/plain' });
    const clipboardItem = new window.ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText });
    
    navigator.clipboard.write([clipboardItem]).then(function () {
        let copiedLabels = document.querySelectorAll(selector)
        for (let i = 0; i < copiedLabels.length; i++) {
            let copiedLabel = copiedLabels[i];
            let orgVal = copiedLabel.innerText
            copiedLabel.innerText = "Copied!"
            setTimeout(() => {
                copiedLabel.innerText = orgVal
            }, 2000);
        }
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}
