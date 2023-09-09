// @ts-nocheck

// console.log(test);

async function getTabs() {
  return await chrome.storage.sync.get().then((items) => {
    return items["history"] ? items["history"] : [];
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
let key = "";
async function tabListener(details,changeInfo ) {
  console.log("DETAILS::", details, changeInfo);
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

  await chrome.storage.sync.clear(() => {
    console.log("cleared");
  }); //! remove after test. This clears the storage.

  const { url, id } = await getCurrentTab();
  const tabsCache = await getTabs();
  if (
    !["", "chrome://extensions/"].includes(url) &&
    !tabsCache?.includes(url)
  ) {
    const urlForm = new FormData();
    urlForm.set("url", url);
    let result = { url }; //! comment below is the right one
    // let result = await getResult(url);

    console.log(Object.keys(result));
    // let notificationId;

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
        await chrome.tabs.sendMessage(
          id,
          { trigger: "modal", tab: id },
          null,
          () => {
            console.log("ping content script");
          }
        );
      } catch (error) {
        console.error("ERRor:::::", error);
      }

      // try {
      // const res = await chrome.tabs.sendMessage(id, "modal" );
      // console.log("RESPONSE MESSAGE::", res);
      // } catch (e) {
      //   console.log(e);
      // }

      // await chrome.scripting
      //   .executeScript({
      //     target: { tabId: id },
      //     files: ["content.js"],
      //   })
      //   .then(() => console.log("script injected", id));
      //!: Check need of implementation. Should be during a `user gesture` like clicking a button....
      // await chrome.notifications.create(
      //   "url alert",
      //   {
      //     type: "basic",
      //     iconUrl: "danger.png",
      //     title: "URL check",
      //     message: "hello there!",
      //     buttons: [
      //       {
      //         title: "Accept",
      //         iconUrl: "danger.png",
      //       },
      //       {
      //         title: "Decline",
      //         iconUrl: "icon.png",
      //       },
      //     ],
      //   },
      //   (value) => {
      //     notificationId = value;
      //     console.log("NOTIFICATION:", value);

      //     // setTimeout(() => {
      //     //   chrome.notifications.clear(value);
      //     // }, 2000);
      //   }
      // );
      // chrome.notifications.onButtonClicked.addListener(function (val, id) {
      //   console.log("clicked no get head", { val }, null);
      //   if (id === 0) {
      //     console.log("clicked", val, 0);
      //   } else if (id === 1) {
      //     console.log("clicked", val, 1);
      //   } else {
      //     console.log("Settings clicked");
      //   }
      // });
    }

    // setTimeout(() => {
    //   chrome.notifications.clear(notificationId);
    // }, 10000);

    await chrome.storage.sync.set({
      currentTab: url,
      history: [...tabsCache, url],
    });
  }
  await chrome.storage.sync.get(null, (data) => {
    console.log("VALUE SET", data);
  });
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

checkUrl();
