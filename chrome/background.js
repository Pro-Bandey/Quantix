chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        const _ = chrome.runtime.lastError;
        chrome.contextMenus.create({
            id: "open-side-panel",
            title: "Open Quantix Panel",
            contexts: ["page"]
        });
    });
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
        .catch((err) => console.error("Failed to set Chrome side panel behavior:", err));
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "open-side-panel") {
        let windowId = tab?.windowId;
        if (!windowId) {
            const currentWindow = await chrome.windows.getCurrent();
            windowId = currentWindow.id;
        }
        chrome.sidePanel.open({ windowId: windowId }).catch((err) => {
            console.error("Failed to open Chrome side panel:", err);
        });
    }
});