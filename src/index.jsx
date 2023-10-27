// @ts-nocheck
import { render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./style.css";
import CHECKMARK from "../public/checkmark.svg";
import DANGER from "../public/danger.svg";
import getResult from "./service-worker";
import Loader from "./loader";

const App = () => {
  const [url, setUrl] = useState("");
  const [malicious, setMalicious] = useState();
  const [loading, setLoading] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(true);
  const [display, setDisplay] = useState(false);

  const urlPattern =
    // /http+[s]?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
    /http+[s]?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
  // /^http+[s]?+(:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$)/;
  // /http+[s]?(:\/\/)((www.)?)(([^.]+)\.)?([a-zA-z0-9\-_]+)(.com|.net|.gov|.org|.in)(\/[^\s]*)?/;

  // const form = useRef(null);

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
  };
  return (
    <div className="container">
      {!loading && <h1>Scan Me</h1>}
      <form className="form" onSubmit={onSubmit}>
        {/* <div className="wrapper"> */}

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
                  className="input-style "
                  type="url"
                  name="url"
                  value={url}
                  // required
                  id="url"
                  placeholder="Enter url"
                  // pattern="http+[s]?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)"
                  onInput={onInput}
                />
                <button type="submit" disabled={checkDisabled}>
                  Check
                </button>
              </div>
            )}
            {/* <div className="data-container">
            {display ? (
              <div>
                {malicious ? (
                  <img src={DANGER} alt="checkmark" />
                ) : (
                  <img src={CHECKMARK} alt="checkmark" />
                )}
              </div>
            ) : (
              // <div>
                <Loader />
              // </div>
            )}
          </div> */}
          </div>
          //   <div className="data-container">
          //   {display ? (
          //     <div>
          //       {malicious ? (
          //         <img src={DANGER} alt="checkmark" />
          //       ) : (
          //         <img src={CHECKMARK} alt="checkmark" />
          //       )}
          //     </div>
          //   ) : (
          //     // <div>
          //       <Loader />
          //     // </div>
          //   )}
          // </div>
          // { display && (
          // <div className="image-container">
          //   {loading ? (
          //     <Loader />
          //   ) : // <img src={LOADER} alt="loader" height={96} width={96} />
          //   malicious ? (
          //     <img src={DANGER} alt="checkmark" />
          //   ) : (
          //     malicious === false && <img src={CHECKMARK} alt="checkmark" />
          //   )}
          // </div>
          // )}
        )}

        {/* </div> */}
      </form>
    </div>
  );
};

render(<App />, document.getElementById("app"));
