// @ts-nocheck

// import { useRef, useState } from "preact/hooks";

alert("WERDTFGBHJNKM");
// // console.log("injected");

// // function logMessage(message) {
// //   console.log("Message from background: ", message);
// // }

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   logMessage(request);
// //   sendResponse("ANIOFWOEINFEW")
// // });
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
//   console.log("SENDER:::", sender);
//   console.log("REQUEST:::", request);
//   if (request.includes("modal")) {
//     alert("USER!!!")
//     sendResponse({ res: "dfgjlokmhbvc" }, true)
//   };
// });
const runModal = () => {
  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",
    `
height:450px;
width:450px;
border: 10px solid red;
top:150px;
border-radius:20px;
background-color:white;
position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
`
  );
  modal.innerHTML = `
<div style="position: absolute; top: 0px; left: 5px; display: flex; flex-direction: row-reverse; align-items: center;">
  <div style="width: 100%; position: relative; left: 5px">
    <button
      style="
        padding: 8px 12px;
        font-size: 16px;
        border: none;
        border-radius: 20px;
        color: #eb433d;
        cursor: pointer;
      "
    >
      &#10005;
    </button>
  </div>
  <div style="width: 100%">
    <img
      width="64"
      height="64"
      src="https://img.icons8.com/arcade/64/exclamation-mark.png"
      alt="exclamation-mark"
    />
    <div>
      <p>This site may be malicious.</p>
      <p>Are you sure you want to proceed?</p>
    </div>
  </div>
</div>
`;
  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  // const iframe = document.getElementById("popup-content");
  // iframe.src = "https://aniwatch.to/watch/horimiya-the-missing-pieces-18421?ep=105852";
  // iframe.frameBorder = 0;
  dialog.querySelector("button").addEventListener("click", () => {
    dialog.close();
  });
};
runModal();


