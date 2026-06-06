browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.removeAll(() => {
        const _ = browser.runtime.lastError;
        browser.contextMenus.create({
            id: "open-side-panel",
            title: "Open Quantix Panel",
            contexts: ["all"]
        });
    });
});
browser.action.onClicked.addListener(() => {
    browser.sidebarAction.toggle().catch((err) => {
        console.error("Failed to open Firefox sidebar:", err);
    });
});
browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-side-panel") {
        browser.sidebarAction.open().catch((err) => {
            console.error("Failed to open Firefox sidebar:", err);
        });
    }
});