import { render } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';
const apiKey = import.meta.env.VITE_API_KEY;
const requestUrl = import.meta.env.VITE_URL;
// export function App() {
// 	const [count, setCount] = useState(0);

// 	return (
// 		<>
// 			<div>
// 				<a href="https://vitejs.dev" target="_blank">
// 					<img src={viteLogo} class="logo" alt="Vite logo" />
// 				</a>
// 				<a href="https://preactjs.com" target="_blank">
// 					<img src={preactLogo} class="logo preact" alt="Preact logo" />
// 				</a>
// 			</div>
// 			<h1>Vite + Preact</h1>
// 			<div class="card">
// 				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
// 				<p>
// 					Edit <code>src/app.jsx</code> and save to test HMR
// 				</p>
// 			</div>
// 			<p class="read-the-docs">Click on the Vite and Preact logos to learn more</p>
// 		</>
// 	);
// }

const App = () => {
  const [url, setUrl] = useState("");
  const handleInput = (event) => {
    setUrl(event.currentTarget.value);
    console.log(url);
  }

  let count = 0;
  const onSubmit = async (event) => {
    const body = new FormData
    body.append("url", url);

    const response = await fetch(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body,
      method: "POST"
    })

    console.log(response);
  }

  return (
    <div>
      <h1>Test Extension</h1>
      <form class="form" onSubmit={onSubmit}>
        <input type="url" name="url" id="url" placeholder="Enter url" onInput={handleInput} />
        <button type="submit">Check</button>
      </form>
    </div>
  );
}

render(<App />, document.getElementById('app'));
