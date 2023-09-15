// @ts-nocheck

async function getTabs() {
  return await chrome.storage.sync.get().then((items) => {
    return items["history"] ? items["history"] : {};
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  try {
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  } catch (error) {
    return {};
  }
}
let key = "";
async function tabListener(details, changeInfo) {
  try {
    key = await fetch(
      "https://95qi9epou7.execute-api.us-east-1.amazonaws.com/default/fetchScanKey",
      { method: "POST" }
    )
      .then(async (res) => {
        const jsonData = await res.json();
        return jsonData?.key;
      })
      .catch(() => {
        return "";
      });
  } catch (err) {
    console.error("Server Error");
  } //! check relevance.

  // await chrome.storage.sync.clear(() => {
  //   console.log("cleared");
  // }); //! remove after test. This clears the storage.

  const { url, id } = await getCurrentTab();
  const urlList = url?.split("/");
  const baseUrl = urlList?.slice(0, 3).join("/");
  const tabsCache = await getTabs();
  if (
    !["", "chrome://extensions/", undefined].includes(url) &&
    Object.keys(tabsCache)?.find((val) => val.includes(baseUrl)) === undefined
  ) {
    const urlForm = new FormData();
    urlForm.set("url", baseUrl);
    let result = await getResult(baseUrl);

    if (Object.keys(result).length > 0) {
      try {
        chrome.storage.sync.set({
          currentTab: url,
          history: { ...tabsCache, ...{ [baseUrl]: false } },
        });
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: stopPageLoad,
        });
        triggerModal(id, baseUrl, url, tabsCache);
      } catch (error) {
        console.error("ERRor:::::", error);
      }
    }
  } else if (
    !["", "chrome://extensions/", undefined].includes(url) &&
    !tabsCache[baseUrl]
  ) {
    chrome.scripting.executeScript({
      target: { tabId: id },
      func: stopPageLoad,
    });
    triggerModal(id, baseUrl, url, tabsCache);
  }
  return;
}

export const checkUrl = async () => {
  // await chrome.tabs.onActivated.addListener(tabListener); //! only runs when a tab is active
  await chrome.tabs.onUpdated.addListener(tabListener); //! only runs on reload and when a tab is active

  return;
};

export default async function getResult(tabUrl) {
  let response = {};
  try {
    const body = JSON.stringify({
      client: {
        clientId: "scanner_App",
        clientVersion: "1.5.2",
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
        platformTypes: ["WINDOWS"],
        threatEntryTypes: ["URL"],
        threatEntries: [
          { url: tabUrl },
          // {
          //   url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/", //! uncomment during testing
          // },
        ],
      },
    });
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body,
    };
    const safetyCheck = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`,
      options
    );
    response = { ...response, ...(await safetyCheck.json()) };
  } catch (e) {
    console.error("Server Error");
  }
  return response;
}

function stopPageLoad() {
  stop();
  document.body.style.visibility = "hidden";
}

function triggerModal(tabId, baseUrl, url, tabsCache) {
  try {
    chrome.tabs.sendMessage(tabId, { trigger: "modal", tab: tabId });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request?.trigger.includes("reload")) {
        chrome.tabs.reload(tabId);
        chrome.storage.sync.set({
          currentTab: url,
          history: { ...tabsCache, ...{ [baseUrl]: true } },
        });
      } else if (request?.trigger.includes("close")) {
        chrome.tabs.remove(tabId);
      }
    });
  } catch (error) {}
}
checkUrl();
