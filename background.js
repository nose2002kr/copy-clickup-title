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

    function takeId() {
        let button = document.querySelector("cu-task-view-task-label button")
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
        let copiedLabels = document.querySelectorAll("cu-task-view-task-label  button > span")
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
