// @ts-nocheck

// alert("WERDTFGBHJNKM");
let sender;
try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sender = sender;
    console.log("SENDER:::", sender);
    console.log("REQUEST:::", request);
    if (request?.trigger.includes("modal")) {
      const tabId = request?.tab;
      console.log("TAB ID IN CONTENT:", tabId);
      runModal(tabId);
      sendResponse({ res: "dfgjlokmhbvc" }, true);
    }
  });
} catch (error) {}

const runModal = async (id) => {
  // let queryOptions = { active: true, lastFocusedWindow: true };
  // let [tab] = await chrome.tabs.query(queryOptions);
  // try {
  //   await chrome.runtime.onMessage.addListener(
  //     (request, sender, sendResponse) => {
  //       console.log("SENDER:::", sender);
  //       console.log("REQUEST:::", request);
  //       if (request.includes("modal")) {
  //         alert("USER!!!");
  //         sendResponse({ res: "dfgjlokmhbvc" }, true);
  //       }
  //     }
  //   );
  // } catch (error) {
  //   console.log(error);
  // }
  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",
    `top:50px;
    position: fixed;
    width: 300px;
    height: 220px;
    padding: 6px 30px;
    border:none;
    border-radius: 8px;
    box-shadow: 2px 2px 20px #0000006b;
     `
  );
  // modal.setAttribute(
  //   "style",
  //   `height:450px;
  //   width:450px;
  //   border: 10px solid red;
  //   top:150px;
  //   border-radius:20px;
  //   background-color:white;
  //   position: fixed;
  //   box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);`
  // );
  //   modal.innerHTML = `
  // <div style="display: flex; flex-direction: row-reverse; gap: 1em; width: 100%; height: 100%;">
  //   <div style="">
  //     <button
  //       style="
  //         padding: 8px 12px;
  //         font-size: 16px;
  //         border: none;
  //         border-radius: 20px;
  //         color: #eb433d;
  //         cursor: pointer;"
  //     >
  //       &#10005;
  //     </button>
  //   </div>
  //   <div style="width: 100%">
  //     <img
  //       width="64"
  //       height="64"
  //       src="https://img.icons8.com/arcade/64/exclamation-mark.png"
  //       alt="exclamation-mark"
  //     />
  //     <div>
  //       <p>This site may be malicious.</p>
  //       <p>Are you sure you want to proceed?</p>
  //     </div>
  //     <div style="width: 100%; position: relative; left: 5px">
  //       <button
  //         style="
  //           padding: 8px 12px;
  //           font-size: 16px;
  //           border: none;
  //           border-radius: 20px;
  //           color: #eb433d;
  //           cursor: pointer;
  //         "
  //       >
  //         Close Page
  //       </button>
  //       <button
  //         style="
  //           padding: 8px 12px;
  //           font-size: 16px;
  //           border: none;
  //           border-radius: 20px;
  //           color: #eb433d;
  //           cursor: pointer;
  //         "
  //       >
  //         Proceed
  //       </button>
  //     </div>
  //   </div>
  // </div>

  // `;
  modal.innerHTML = `

  
             <div
  style="
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    color: #070707;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    overflow: scroll;
    
  "
>
  <div style="
    width: 65px;
    height: 65px;
    display: grid;
    
    justify-content: center;
  ">
    <img
      src="https://img.icons8.com/arcade/64/exclamation-mark.png"
      alt="exclamation-mark"
    />
  </div>
  <!-- <p style="font-size: 1.2em; font-weight: 400; color: #1a1a1a">
    Alert
  </p> -->
  <p>
    We use cookies to ensure that we give you the best experience on our
    website.
  </p>

  <div
    class="buttonContainer"
    style="display: flex; gap: 20px; flex-direction: row"
  >
    <button
      style="
        width: 80px;
        height: 30px;
        background-color: #be1e21;
        transition-duration: 0.2s;
        border: none;
        color: #ffffff;
        cursor: pointer;
        font-weight: 600;
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px #740a42, 0 2px 4px -1px #f98ba6;
        transition: all 0.6s ease;
      "
  class = "allow"

    >
      Allow
    </button>
    <button
      style="
        width: 80px;
        height: 30px;
        background-color: #929292;
        transition-duration: 0.2s;
        color: #ffffff;
        border: none;
        cursor: pointer;
        font-weight: 600;
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px #2d2b2b, 0 2px 4px -1px #1e1a1a;;
        transition: all 0.6s ease;
      "
    class="close"


    >
      Close
    </button>
  </div>
</div>

`;

  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  // const iframe = document.getElementById("popup-content");
  // iframe.src = "https://aniwatch.to/watch/horimiya-the-missing-pieces-18421?ep=105852";
  // iframe.frameBorder = 0;
  dialog.querySelector(".close").addEventListener("click", () => {
    try {
      chrome.runtime.sendMessage(sender, { trigger: "close" }, () => {
        console.log("Page close trigger", sender);
      });
    } catch (error) {}
    dialog.close();
  });
  dialog.querySelector(".allow").addEventListener("click", () => {
    try {
      chrome.runtime.sendMessage(sender, { trigger: "reload" }, () => {
        console.log("Page load trigger", sender);
      });
    } catch (error) {}
    document.body.style.visibility = "visible";
    dialog.close();
  });
};
