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
        { url: "https://clicnews.com" },
        { url: "https://tryteens.comm" },
        {
          url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
        },
      ],
    },
  });
  try {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body,
    };

    const key = await fetch(
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

    const safetyCheck = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`,
      options
    );
    const result = await safetyCheck.json();
    console.log(result);
  } catch (err) {
    console.error("ERROR:::", err);
  }
  await chrome.storage.sync.clear(() => {
    console.log("cleared");
  }); //! remove after test. This clears the storage.
  const tabUrl = await getCurrentTab();
  const tabsCache = await getTabs();
  if (
    !["", "chrome://extensions/"].includes(tabUrl) &&
    !tabsCache?.includes(tabUrl)
  ) {
    const data = new FormData();
    data.set("url", tabUrl);
    getResult(tabUrl, (response) => {
      console.log("API CALL RESPONSE ::", response);
    });
    await chrome.storage.sync.set(
      {
        currentTab: tabUrl,
        history: [...tabsCache, tabUrl],
      },
      () => {
        console.log("Setting values");
      }
    );
  }
  await chrome.storage.sync.get(null, (data) => {
    console.log("VALUE SET", data);
  });
  return;
}

export const checkUrl = async () => {
  await chrome.tabs.onActivated.addListener(tabListener);
  return;
};

/**
 * @param {FormData} body
 * @param {any} callback
 */
export default async function getResult(body, callback) {
  // const response = await axios(requestUrl, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-api-key": apiKey,
  //   },
  //   body,
  //   method: "POST",
  // });
  // console.log("response", apiKey, requestUrl);
}
checkUrl();
