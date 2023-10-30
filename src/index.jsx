// @ts-nocheck
import { render } from "preact";
import { useState } from "preact/hooks";
import CHECKMARK from "../public/checkmark.svg";
import DANGER from "../public/danger.svg";
import Loader from "./loader";
import getResult from "./service-worker";
import "./style.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [malicious, setMalicious] = useState();
  const [loading, setLoading] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [display, setDisplay] = useState(false);

  const urlPattern = /http+[s]?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

  const onInput = async (event) => {
    const { value } = event.target;
    setCheckDisabled(!value?.match(urlPattern));
    console.log(checkDisabled);
    setUrl(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let result = await getResult(url);
    if (Object.keys(result).length > 0) {
      setLoading(false);
      setDisplay(true);
      setMalicious(true);
    } else {
      setLoading(false);
      setDisplay(true);
      setMalicious(false);
    }
    setTimeout(() => {
      setUrl("");
      setDisplay(false);
    }, 3000);
  };
  return (
    <div className="container">
      {!loading && <h1>Scan Me</h1>}
      <form className="form" onSubmit={onSubmit}>
        {loading ? (
          <div className="data-container">
            <Loader />
          </div>
        ) : (
          <div>
            {display ? (
              <div className="image-container">
                {malicious ? (
                  <img src={DANGER} alt="checkmark" />
                ) : (
                  <img src={CHECKMARK} alt="checkmark" />
                )}
              </div>
            ) : (
              <div className="input-container">
                <input
                  className="input-style"
                  type="url"
                  name="url"
                  value={url}
                  id="url"
                  placeholder="Enter url"
                  onInput={onInput}
                />
                <button type="submit" disabled={checkDisabled}>
                  Scan
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

render(<App />, document.getElementById("app"));
