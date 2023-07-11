
import { render } from "preact";
import { useRef, useState } from "preact/hooks";
import "./style.css";
import { gettingCurrent } from "./service-worker";

const apiKey = import.meta.env.VITE_API_KEY;
const requestUrl = import.meta.env.VITE_URL;

const App = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  
  const form = useRef(null);
  
  const onInput = async (event) => {

    await gettingCurrent();
    const { value } = event.target;
    setUrl(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(form.current);
    for (let items of data) {
      console.log(items);
    }

    // console.log(gettingCurrent);
    // const response = await fetch(requestUrl, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-api-key": apiKey,
    //   },
    //   body,
    //   method: "POST",
    // });

    // console.log(response);
  };

  return (
    <div>
      <h1>Test Extension</h1>
      <form className="form" ref={form} onSubmit={onSubmit}>
        <div>
          <input
            type="url"
            name="url"
            value={url}
            id="url"
            placeholder="Enter url"
            onInput={onInput}
          />
          <p>Invalid url</p>
        </div>
        <button type="submit">Check</button>
      </form>
    </div>
  );
};

render(<App />, document.getElementById("app"));
