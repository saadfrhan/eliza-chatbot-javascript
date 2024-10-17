const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const userInputContainer = document.getElementById("user-input-container");

const responses = [
  { pattern: /hello/i, response: "Hello! How are you feeling today?" },
  {
    pattern: /how are you/i,
    response: "I appreciate your concern. How do you feel?",
  },
  {
    pattern: /what is your name/i,
    response:
      "I am Eliza, your virtual therapist. Who do you wish to talk about today?",
  },
  {
    pattern: /help/i,
    response: "I'm here to listen. What is it that you seek help with?",
  },
  { pattern: /bye/i, response: "Goodbye! I hope you take care of yourself." },
  {
    pattern: /i need (.*)/i,
    response: "What leads you to feel that you need $1?",
  },
  { pattern: /i am (.*)/i, response: "How long have you felt you are $1?" },
  {
    pattern: /i feel (.*)/i,
    response: "What do you think is causing you to feel $1?",
  },
  { pattern: /because (.*)/i, response: "Does that truly capture the reason?" },
  {
    pattern: /sorry/i,
    response: "It’s okay. What are you feeling sorry about?",
  },
  { pattern: /i think (.*)/i, response: "What makes you think $1?" },
  { pattern: /yes/i, response: "What makes you feel that way?" },
  { pattern: /no/i, response: "What is it that leads you to say no?" },
  { pattern: /perhaps/i, response: "What do you feel is holding you back?" },
  {
    pattern: /you are (.*)/i,
    response: "What leads you to perceive me as $1?",
  },
  {
    pattern: /you (.*)/i,
    response: "Let's focus on your thoughts and feelings.",
  },
  { pattern: /.*/, response: "Please, tell me more about that." },
];

function getResponse(input) {
  for (let i = 0; i < responses.length; i++) {
    const match = input.match(responses[i].pattern);
    if (match) {
      return responses[i].response.replace("$1", match[1]);
    }
  }
  return "Tell me more about that.";
}

async function typeEffect(element, text) {
  if (!element) return; // Ensure element is defined

  for (let i = 0; i < text.length; i++) {
    element.innerHTML = "ELIZA: " + text.substring(0, i + 1);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust typing speed here
  }

  element.innerHTML = "ELIZA: " + text;
}

async function sendMessage() {
  const userText = userInput.value.trim();

  if (userText) {
    userInputContainer.style.display = "none";
    chatbox.innerHTML += `<div style="display: flex;"><p>YOU:&nbsp;</p> <p>${userText}</p></div>`;
    userInput.value = "";

    const botResponse = getResponse(userText);
    const botResponseElement = document.createElement("div");
    botResponseElement.style.marginBlock = "10px";
    chatbox.appendChild(botResponseElement);

    await typeEffect(botResponseElement, botResponse);

    chatbox.scrollTop = chatbox.scrollHeight;
    userInputContainer.style.display = "flex";
    userInput.focus();
  }
}

// Debounce function to prevent multiple rapid calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSendMessage = debounce(sendMessage, 300);

userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent newline in textarea
    debouncedSendMessage();
  }
});

(async () => {
  const firstParagraph = chatbox.querySelector("p");
  await typeEffect(
    firstParagraph,
    "Hello, I am Eliza. I'll be your therapist today."
  );

  userInputContainer.style.display = "flex";
  userInput.focus();
})();
