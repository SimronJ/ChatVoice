// content.js
console.log("Content script loaded");

let soundEnabled = false;

// Function to play sound
function playSound() {
  const soundURL = "https://www.myinstants.com/media/sounds/kekw-laugh.mp3"; // URL of the audio file
  const sound = new Audio(soundURL);
  sound.play().then(() => {
    console.log("Sound played successfully");
  }).catch((error) => {
    console.error("Error playing sound:", error);
  });
}

// Function to check for keywords in chat messages
function checkForKeywords(message, emotes) {
  console.log("Checking message:", message); // Log message content
  if (soundEnabled) { // Only play sound if soundEnabled is true
    for (const keyword of emotes) {
      if (message.includes(keyword)) {
        console.log("Emote found:", keyword); // Log if emote is found
        playSound();
        break;
      }
    }
  }
}

// Monitor chat messages
function monitorChat(emotes) {
  const textChatMessages = document.evaluate(
    '//*[@id="chatroom"]/div[2]/div/div/div/div/span[3]/span',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  console.log("Number of text chat messages:", textChatMessages.snapshotLength);

  for (let i = 0; i < textChatMessages.snapshotLength; i++) {
    const messageElement = textChatMessages.snapshotItem(i);
    const message = messageElement.innerText || messageElement.textContent;
    checkForKeywords(message, emotes);
  }

  const emoteChatMessages = document.evaluate(
    '//*[@id="chatroom"]/div[2]/div[1]/div/div/div/span[3]/div/div/img[@data-emote-name]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  console.log("Number of emote chat messages:", emoteChatMessages.snapshotLength);

  for (let i = 0; i < emoteChatMessages.snapshotLength; i++) {
    const messageElement = emoteChatMessages.snapshotItem(i);
    const emote = messageElement.getAttribute("data-emote-name");
    checkForKeywords(emote, emotes);
  }

  // Use MutationObserver to monitor future chat messages
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const textMessageElement = document.evaluate(
            './/span[3]/span',
            node,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          if (textMessageElement) {
            const message = textMessageElement.innerText || textMessageElement.textContent;
            checkForKeywords(message, emotes);
          }
          const emoteMessageElement = document.evaluate(
            './/span[3]/div/div/img[@data-emote-name]',
            node,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          if (emoteMessageElement) {
            const emote = emoteMessageElement.getAttribute("data-emote-name");
            checkForKeywords(emote, emotes);
          }
        }
      });
    });
  });

  observer.observe(document.getElementById("chatroom"), { childList: true, subtree: true });
}

// Inject enable sound button into the webpage
function injectEnableSoundButton() {
  const existingButton = document.getElementById("enable-sound-button");
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement("button");
  button.innerText = "Enable Sound";
  button.id = "enable-sound-button";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "red";
  button.style.color = "white";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      button.innerText = "Disable Sound";
      button.style.backgroundColor = "green";
      chrome.storage.sync.get("emotes", (data) => {
        const emotes = data.emotes || [];
        console.log("Loaded emotes:", emotes);
        monitorChat(emotes);
      });
    } else {
      button.innerText = "Enable Sound";
      button.style.backgroundColor = "red";
    }
  });
}

// Observe URL changes to re-inject the button
let currentUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    soundEnabled = false; // Reset soundEnabled to false when URL changes
    injectEnableSoundButton(); // Re-inject the button
  }
});

observer.observe(document.body, { childList: true, subtree: true });

injectEnableSoundButton();
