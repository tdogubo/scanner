// @ts-nocheck

async function getTabs() {
  return await chrome.storage.sync.get().then((items) => {
    console.log("ITEMS CAME AS::", items["history"]);
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
    // key = await fetch(
    //   "https://95qi9epou7.execute-api.us-east-1.amazonaws.com/default/fetchScanKey",
    //   { method: "POST" }
    // )
    //   .then(async (res) => {
    //     const jsonData = await res.json();
    //     return jsonData?.key;
    //   })
    //   .catch(() => {
    //     return "";
    //   });
  } catch (err) {
    console.error("Server Error");
  } //! check relevance.

  // await chrome.storage.sync.clear(() => {
  //   console.log("cleared");
  // }); //! remove after test. This clears the storage.

  const { url , id } = await getCurrentTab();
  const urlList = url?.split("/");
  const baseUrl = urlList?.slice(0, 3).join("/");
  const tabsCache = await getTabs();
  const test = {
    "https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable": false,
    "https://www.w3schools.com/jsref/prop_style_visibility.asp ": false,
    undefined: false,
  };
  let idea = false;
  console.log(
    baseUrl,
    "BASE",
    !idea,
    !tabsCache[baseUrl],
    tabsCache[baseUrl] === true,
    Object.keys(tabsCache)?.find((val) => val.includes(baseUrl)) === undefined
  );
  if (
    !["", "chrome://extensions/", undefined].includes(url) &&
    Object.keys(tabsCache)?.find((val) => val.includes(baseUrl)) === undefined
  ) {
    const urlForm = new FormData();
    urlForm.set("url", baseUrl);
    let result = { baseUrl }; //! comment below is the right one
    // let result = await getResult(url);

    if (Object.keys(result).length === 0) {
      console.log("ALL GOOD");
    } else {
      try {
        // chrome.runtime.onMessage.addListener(function (
        //   msg,
        //   sender,
        //   sendResponse
        // ) {
        //   if (msg.closeTab) {
        //     chrome.tabs.remove(sender.tab.id);
        //   }
        // });

        // chrome.tabs.update(id, { active: false, pinned: true }, () => {
        //   console.log("TAB DISPLACED");
        // }); // !

        chrome.storage.sync.set(
          {
            currentTab: url,
            history: { ...tabsCache, ...{ [baseUrl]: false } },
          },
          (items) => {
            console.log("SAVED ITEMS::", items);
          }
        );
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
  // await chrome.tabs.onActivated.addListener(tabListener);
  await chrome.tabs.onUpdated.addListener(tabListener);

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
          {
            url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
          },
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
        chrome.tabs.reload(tabId, () => {
          console.log("Page loaded");
        });
        chrome.storage.sync.set(
          {
            currentTab: url,
            history: { ...tabsCache, ...{ [baseUrl]: true } },
          },
          () => {
            chrome.storage.sync.get(null, (data) => {
              console.log("UPDATED ITEMS::", data);
            });
          }
        );
      } else {
        chrome.tabs.remove(tabId);
      }
    });
  } catch (error) {}
}
checkUrl();
