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
let key = "";
async function tabListener() {
  
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
    const urlForm = new FormData();
    urlForm.set("url", tabUrl);
    let result = await getResult(tabUrl);

    console.log(Object.keys(result));

    if (Object.keys(result).length === 0) {
      console.log("ALL GOOD");
    } else {
      // await chrome.permissions.request(
      //   {
      //     permissions: ["notifications"],
      //   },
      //   function (granted) {
      //     if (granted) {
      //       // do this
      //     } else {
      //       // do that
      //     }
      //   }
      // ); //TODO: Check need of implementation. Should be during a `user gesture` like clicking a button....
      chrome.notifications.create(
        "url alert",
        {
          type: "basic",
          iconUrl: "danger.png",
          title: "URL check",
          message: "hello there!",
        },
        (value) => {
          setTimeout(() => {
            chrome.notifications.clear(value);
          }, 2000);
        }
      );
    }

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

export const checkUrl = async () => {
  await chrome.tabs.onActivated.addListener(tabListener);
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

checkUrl();
