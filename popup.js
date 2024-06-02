document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save");
    const emotesInput = document.getElementById("emotes");
  
    // Load saved emotes
    chrome.storage.sync.get("emotes", (data) => {
      if (data.emotes) {
        emotesInput.value = data.emotes.join(", ");
      }
    });
  
    // Save emotes to storage
    saveButton.addEventListener("click", () => {
      const emotes = emotesInput.value.split(",").map(emote => emote.trim());
      chrome.storage.sync.set({ emotes }, () => {
        console.log("Emotes saved:", emotes);
      });
    });
  });
  