import CONFIG from './config.js';

function makeTitleFunny(originalTitle) {
  return new Promise(async (resolve) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
		Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a sassy and satiric language model well versed in slang. Your job is to take news headlines and rewrite them in the style of the Reductress." },
          { role: "user", content: `Rewrite this headline: "${originalTitle}"` },
        ],
      }),
    });

    const data = await response.json();
    const funnyTitle = data.choices[0].message.content.trim();
    console.log(`Funny title: "${funnyTitle}"`);
    resolve(funnyTitle);
  });
}

   
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "requestFunnyTitle") {
    makeTitleFunny(request.originalTitle).then((funnyTitle) => {
      sendResponse({ funnyTitle: funnyTitle });
    });
    return true; // Required for async response
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: "updateTitle" });
});

