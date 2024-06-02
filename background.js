// let soundEnabled = false;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "enableSound") {
//     soundEnabled = true;
//     console.log("Sound enabled by user");
//     sendResponse({ status: "success" });
//   } else if (message.action === "keywordDetected" && soundEnabled) {
//     const soundURL = "https://www.myinstants.com/media/sounds/kekw-laugh.mp3"; // URL of the audio file
//     const sound = new Audio(soundURL);
//     sound.play().then(() => {
//       console.log("Sound played successfully");
//     }).catch((error) => {
//       console.error("Error playing sound:", error);
//     });
//   }
// });
