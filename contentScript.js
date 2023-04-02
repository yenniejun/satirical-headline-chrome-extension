chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTitle") {
    updateTitle();
  }
});

const sassyEmojis = ["💅","🙃", "💖", "💁🏻‍♀️", "🌚", "✨","🧚‍♀️","🌹","💋","🗿","😺", "😸", "😹",
 "😻","😽","🙀","😿","😾","🫶🏻","🤨","🫡","🐪","👅"]

function getRandomSassyEmoji() {
  const randomIndex = Math.floor(Math.random() * sassyEmojis.length);
  return sassyEmojis[randomIndex];
}

function updateTitle() {
  console.log("updateTitle called");
  const titleSelectors = [
    "h1",
    ".title",
    ".headline",
    ".article-title",
    ".post-title"
  ];

  let titleElement = document.querySelector("h1");

  if (!titleElement) {
    titleElement = document.querySelector(titleSelectors.join(", "));
  }

  if (titleElement) {
    if (titleElement.hasAttribute("data-original-title")) {
      titleElement.textContent = titleElement.getAttribute("data-original-title");
      titleElement.removeAttribute("data-original-title");
    } else {
      const originalTitle = titleElement.textContent;
      chrome.runtime.sendMessage({ action: "requestFunnyTitle", originalTitle: originalTitle }, (response) => {
        if (response && response.funnyTitle) {
          titleElement.setAttribute("data-original-title", originalTitle);
          titleElement.textContent = getRandomSassyEmoji() + " " + response.funnyTitle;
        }
      });
    }
  } else {
    console.log("Title element not found");
  }
}
