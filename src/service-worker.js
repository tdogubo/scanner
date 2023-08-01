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
  // const body = {
  //   // client: {
  //   //   clientId: "yourcompanyname",
  //   //   clientVersion: "1.5.2",
  //   // },
  //   // threatInfo: {
  //   //   threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
  //   //   platformTypes: ["WINDOWS"],
  //   //   threatEntryTypes: ["URL"],
  //   //   threatEntries: [
  //   //     { url: "http://www.urltocheck1.org/" },
  //   //     { url: "https://malware.testing.google.test/testing/malware/" },
  //   //     {
  //   //       url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
  //   //     },
  //   //   ],
  //   // },
  //   client: {
  //     clientId: "scanner_App",
  //     clientVersion: "1.5.2",
  //   },
  //   threatInfo: {
  //     threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
  //     platformTypes: ["WINDOWS"],
  //     threatEntryTypes: ["URL"],
  //     threatEntries: [
  //       { url: "https://preactjs.com/guide/v10/forms/" },
  //       { url: "https://malware.testing.google.test/testing/malware/" },
  //       {
  //         url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
  //       },
  //     ],
  //   },
  // };
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
        { url: "https://malware.testing.google.test/testing/malware/" },
        {
          url: "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
        },
      ],
    },
  });
  try {
    // const test = await fetch(
    //   "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyDS7hezSOudyOGdp9I2LqFtMMdSA5IaL5Y",
    //   {
    //     method: "POST",
    //     headers: {
    //       append: { "Content-Type": "text/plain" },
    //     },
    //   },
    //   body
    // );

    // const reader = test.body.getReader();

    // const response = await reader.read().then(function pump({ done, value }) {
    //   if (done) {
    //     //     reader.releaseLock();

    //     // Do something with last chunk of data then exit reader
    //     return;
    //   }
    //   console.log("VALUE IN PUMP FUNCT", value);
    //   // Otherwise do something here to process current chunk

    //   // Read some more, and call this function again
    //   return reader.read().then(pump);
    // });

    async function toJSON(body) {
      const reader = body.getReader(); // `ReadableStreamDefaultReader`
      const decoder = new TextDecoder();
      const chunks = [];

      async function read() {
        const { done, value } = await reader.read();

        // all chunks have been read?
        if (done) {
          console.log("chunks::", chunks);
          return JSON.parse(chunks.join(""));
        }

        const chunk = decoder.decode(value, { stream: true });
        chunks.push(chunk);
        return read(); // read the next chunk
      }

      return read();
    }

    // const headers = new Headers({
    //   "Content-Type": "application/json",
    // });
    // headers.append("user", { name: "Tahmee", email: "tahnmee@gmail.com" });

    const response = await fetch(
      "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyDS7hezSOudyOGdp9I2LqFtMMdSA5IaL5Y",
      {
        method: "POST",
        mode: "cors",
        // headers,
        headers: {
          "Content-Type": "application/json",
          //   "Access-Control-Allow-Origin": "*",
          //   append: {
          //     user: { name: "Tahmee", email: "tahnmee@gmail.com" },
        },
        //   // user: { name: "Tahmee", email: "tahnmee@gmail.com" },
        // },
      },
      body
    );
    //! MAKE SURE THE REQUEST IS WORKING. NO NEED TO USE A READER `REQUEST.JSON()` WORKS PERFECTLY.

    // const reader = response.body.getReader();
    // // let charsReceived = 0;
    // let chunk;
    // await reader.read().then(function processText({ done, value }) {
    //   // Result objects contain two properties:
    //   // done  - true if the stream has already given you all its data.
    //   // value - some data. Always undefined when done is true.
    //   if (done) {
    //     console.log("Stream complete");
    //     return;
    //   }
    //   console.log("VALUE: " + value);
    //   chunk = value;
    //   // Read some more, and call this function again
    //   return reader.read().then(processText);
    // });
    console.log(response);
    const val = await response.json();
    val.test = "test";
    console.log(val, val?.matches);

    // const string = new TextDecoder().decode(chunk);
    // const data = JSON.parse(string);
    // console.log(chunk, string);
  } catch (err) {
    console.error(err);
  }
  // const apiKey = process.env.VITE_API_KEY;
  // const requestUrl = import.meta.env.VITE_URL;
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
