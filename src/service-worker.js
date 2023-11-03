// @ts-nocheck

async function getTabs() {
  return await chrome.storage.local.get().then((items) => {
    return items["history"] ? items["history"] : {};
  });
}

async function tabListener(tabId, changeInfo, tabDetails) {
  await chrome.storage.local.clear(() => {
    console.log("cleared");
  }); //! Clear storage. Uncomment only during testing.

  const { url } = tabDetails;
  const urlList = url?.split("/");
  const baseUrl = urlList?.slice(0, 3).join("/");
  const tabsCache = await getTabs();

  if (
    !["", undefined].includes(url) &&
    !url.includes("chrome://") &&
    Object.keys(tabsCache)?.find((val) => val.includes(baseUrl)) === undefined
  ) {
    let result = await getResult(url);

    if (result?.threat) {
      try {
        chrome.storage.local.set({
          currentTab: url,
          history: { ...tabsCache, ...{ [baseUrl]: false } },
        });
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: stopPageLoad,
        });
        triggerModal(tabId, baseUrl, url, tabsCache);
      } catch (error) {
        console.error("ERRor:::::", error);
      }
    }
  } else if (
    !["", undefined].includes(url) &&
    !url.includes("chrome://") &&
    !tabsCache[baseUrl]
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: stopPageLoad,
    });
    triggerModal(tabId, baseUrl, url, tabsCache);
  }
  return;
}

export const checkUrl = async () => {
  // await chrome.tabs.onActivated.addListener(tabListener); //! only runs when a tab is active
  await chrome.tabs.onUpdated.addListener(tabListener); //! only runs on reload and when a tab is active
  return;
};

export default async function getResult(tabUrl) {
  let key = "";
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
  let response = {};
  try {
    // const body = JSON.stringify({
    //   client: {
    //     clientId: "scanner_App",
    //     clientVersion: "1.5.2",
    //   },
    //   threatInfo: {
    //     threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
    //     platformTypes: ["WINDOWS"],
    //     threatEntryTypes: ["URL"],
    //     threatEntries: [
    //       { url: tabUrl },
    //       // {
    //       //   url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/", //! uncomment during testing
    //       // },
    //     ],
    //   },
    // }); //! Body not necessary while using the web risk api
    const options = {
      // method: "POST", //! Web risk API is default GET request
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      // body,
    };
    const safetyCheck = await fetch(
      `https://webrisk.googleapis.com/v1/uris:search?threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&uri=${tabUrl}&key=${key}`,
      // `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, //!only for GOOGLE safe browsing url
      options
    );
    response = { ...response, ...(await safetyCheck.json()) };
    //TODO: Add url to local storage if response returns threat.
  } catch (e) {
    console.error("Server Error");
  }
  return response;
}

//!Add result from response to local storage

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
        chrome.storage.local.set({ //! Check if this is already set in getResult 
          currentTab: url,
          history: { ...tabsCache, ...{ [baseUrl]: true } },
        });
      } else if (request?.trigger.includes("close")) {
        chrome.tabs.remove(tabId);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
checkUrl();
