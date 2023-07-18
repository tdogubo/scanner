// @ts-nocheck

async function getTabs() {
  return await chrome.storage.sync.get().then((items) => {
    return items["history"] ? items["history"] : [];
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}

async function tabListener() {
  const tabUrl = await getCurrentTab();
  const tabsCache = await getTabs();
  console.log("TEST:::", tabsCache);
  if (!tabsCache?.includes(tabUrl)) {
    await chrome.storage.sync.set({
      currentTab: tabUrl,
      history: [...tabsCache, tabUrl],
    });
  }
  await chrome.storage.sync.get(null, (data) => {
    console.log("VALUE SET", data);
  });
  return;
}

export const gettingCurrent = () => {
  chrome.tabs.onActivated.addListener(tabListener);
  return;
};
gettingCurrent();
