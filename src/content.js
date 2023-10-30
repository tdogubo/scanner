// @ts-nocheck

let sender;
try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sender = sender;
    if (request?.trigger.includes("modal")) {
      runModal();
      sendResponse({ res: "Ext response" }, true); //! response validity
    }
  });
} catch (error) {console.log("ERROR ON CONTENT END::: ", error);}

const runModal = async () => {
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
	font-family: 'Quicksand', sans-serif;

     `
  );
  
  modal.innerHTML = `
 <div
  style=" width: 100%;
    height: 100%;
    background-color: #ffffff;
    color: #070707;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    overflow: scroll; " >
    <style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');
</style>

  <div style="
    width: 65px;
    height: 65px;
    display: grid;
    justify-content: center;" >

    <img
      src="https://img.icons8.com/arcade/64/exclamation-mark.png"
      alt="exclamation-mark" />
 
     </div>
  <p>
    The site you're about visiting is probably malicious....
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
        font-weight: 500;
        font-size: 1em;
        border-radius: 1em;
        box-shadow: 0 4px 6px -1px #740a42, 0 2px 4px -1px #f98ba6;
        transition: all 0.6s ease;
      "
  class = "allow"
  onMouseOver = 'this.style.backgroundColor= "#de6567"' onMouseOut = 'this.style.backgroundColor= "#be1e21"'>
      Allow
    </button>

    <button
      style="
        width: 80px;
        height: 30px;
        background-color: #4b95f7;
        transition-duration: 0.2s;
        color: #ffffff;
        border: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 1em;
        border-radius: 1em;
        box-shadow: 0 4px 6px -1px #2d2b2b, 0 2px 4px -1px #1e1a1a;;
        transition: all 0.6s ease;"
    class="close"
    onMouseOver = 'this.style.backgroundColor= "#83b9ff"' onMouseOut = 'this.style.backgroundColor= "#4b95f7"'>
      Close
    </button>

  </div>
</div>
`;

  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");

  dialog.showModal();

  dialog.querySelector(".close").addEventListener("click", () => {
    try {
      chrome.runtime.sendMessage(sender, { trigger: "close" });
    } catch (error) {}
    dialog.close();
  });
  
  dialog.querySelector(".allow").addEventListener("click", () => {
    try {
      chrome.runtime.sendMessage(sender, { trigger: "reload" });
    } catch (error) {}
    document.body.style.visibility = "visible";
    dialog.close();
  });
};
