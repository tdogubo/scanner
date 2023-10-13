// @ts-nocheck
import { render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./style.css";
import getResult from "./service-worker";
// import { checkUrl } from "./service-worker";

const App = () => {
  const [url, setUrl] = useState("");
  const [malicious, setMalicious] = useState(false);
  const [consent, setConsent] = useState(false);
  const [val, setVal] = useState("");

  // const form = useRef(null);

  const onInput = async (event) => {
    const { value } = event.target;
    setUrl(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let result = await getResult(url);
    if (Object.keys(result).length > 0) {
      setMalicious(true);
    }
    // const data = new FormData(form.current);
    // for (let items of data) {
    //   console.log(items);
    // }

    // console.log(gettingCurrent);
    // const response = await axios(requestUrl, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-api-key": apiKey,
    //   },
    //   body,
    //   method: "POST",
    // });
    // console.log(response);
  };

  // var init_tabs = null;
  // chrome.storage.sync.get("currentTab", (result) => {
  //   init_tabs = result.currentTab;
  //   console.log("INDEX::", result.currentTab);
  // });
  // const [tabs, setTabs] = useState(init_tabs);
  // console.log(tabs);
  return (
    <div>
      <h1>Test Extension</h1>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <input
            type="url"
            name="url"
            value={url}
            required
            id="url"
            placeholder="Enter url"
            onInput={onInput}
          />
        </div>
        <button type="submit">Check</button>
        {malicious&& <h2>MALICIOUS!!</h2>}
      </form>
    </div>
  );
};

render(<App />, document.getElementById("app"));
