// @ts-nocheck

export const gettingCurrent = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };

  let tab = await chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      let tabUrl = tab.url;
      console.log("you are here: ", tabUrl);
    });
    // });
    // const tab = await chrome.tabs;
    // chrome.tabs.onActivated.addListener(function (activeInfo) {
    //   chrome.tabs.get(activeInfo.tabId, function (tab) {
    //     let y = tab.url;
    //     console.log("you are here: " + y);
    //   });
    // });
    // chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    //   if (tab.active && change.url) {
    //     console.log("you are here: " + change.url);
    //   }
  });
  console.log("TAB:: ", tab);
};
gettingCurrent();
