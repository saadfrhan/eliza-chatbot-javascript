const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const userInputContainer = document.getElementById("user-input-container");

const responses = [
  { pattern: /hello/i, response: "Hello! How are you feeling today?" },
  { pattern: /how are you/i, response: "I appreciate your concern. How do you feel?" },
  { pattern: /what is your name/i, response: "I am Eliza, your virtual therapist. Who do you wish to talk about today?" },
  { pattern: /help/i, response: "I'm here to listen. What is it that you seek help with?" },
  { pattern: /bye/i, response: "Goodbye! I hope you take care of yourself." },
  { pattern: /i need (.*)/i, response: "What leads you to feel that you need $1?" },
  { pattern: /i am (.*)/i, response: "How long have you felt you are $1?" },
  { pattern: /i feel (.*)/i, response: "What do you think is causing you to feel $1?" },
  { pattern: /because (.*)/i, response: "Does that truly capture the reason?" },
  { pattern: /sorry/i, response: "It’s okay. What are you feeling sorry about?" },
  { pattern: /i think (.*)/i, response: "What makes you think $1?" },
  { pattern: /yes/i, response: "What makes you feel that way?" },
  { pattern: / no /i, response: "What is it that leads you to say no?" },
  { pattern: /perhaps/i, response: "What do you feel is holding you back?" },
  { pattern: /you are (.*)/i, response: "What leads you to perceive me as $1?" },
  { pattern: /you (.*)/i, response: "Let's focus on your thoughts and feelings." },
  { pattern: /i want (.*)/i, response: "What steps do you think you can take to achieve $1?" },
  { pattern: /i feel (.*) about (.*)/i, response: "What is it about $2 that makes you feel $1?" },
  { pattern: /what should i do/i, response: "What options do you believe you have?" },
  { pattern: /i don't know/i, response: "It's okay to feel uncertain. What are you feeling unsure about?" },
  { pattern: /tell me more/i, response: "Sure! What specific part would you like to elaborate on?" },
  { pattern: /my (.*)/i, response: "How does your $1 affect your feelings?" },
  { pattern: /i feel like (.*)/i, response: "What makes you feel that way?" },
  { pattern: /what do you mean/i, response: "Can you clarify what you’re asking about?" },
  { pattern: /i hope/i, response: "What gives you hope in this situation?" },
  { pattern: /i fear/i, response: "What is it that you are afraid of?" },
  { pattern: /it's been (.*) since (.*)/i, response: "How has it been for you since $2?" },
  { pattern: /thanks/i, response: "You're welcome. What else would you like to talk about?" },
  { pattern: /i love/i, response: "What is it about $1 that you love?" },
  { pattern: /i hate/i, response: "What is it about $1 that you hate?" },
  { pattern: /i want to (.*)/i, response: "What steps do you think you can take to $1?" },
  { pattern: /i don't (.*)/i, response: "What makes you feel that you don't $1?" },
  { pattern: /i can't (.*)/i, response: "What makes you feel that you can't $1?" },
  { pattern: /i can (.*)/i, response: "What makes you feel that you can $1?" },
  { pattern: /i think (.*)/i, response: "What makes you think $1?" },
  { pattern: /i feel (.*)/i, response: "What makes you feel $1?" },
  { pattern: /i am (.*)/i, response: "What makes you feel that you are $1?" },
  { pattern: /i'm (.*)/i, response: "What makes you feel that you're $1?" },
  { pattern: /i (.*)/i, response: "What makes you feel that you $1?" },
  { pattern: /(.*)/i, response: "Tell me more about that." },
];

function getResponse(input) {
  for (let i = 0; i < responses.length; i++) {
    const match = input.match(responses[i].pattern);
    if (match) {
      let response = responses[i].response;
      for (let j = 1; j < match.length; j++) {
        response = response.replace(`$${j}`, pronouns(match[j]));
      }
      return response;
    }
  }
  return "Tell me more about that.";
}

async function typeEffect(element, text) {
  if (!element) return; 

  for (let i = 0; i < text.length; i++) {
    element.innerHTML = "ELIZA: " + text.substring(0, i + 1);
    await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust typing speed here
  }

  element.innerHTML = "ELIZA: " + text;
}

function pronouns(text) {
  return text
    .replace(/\bI\b/g, "you")
    .replace(/\bme\b/g, "you")
    .replace(/\bmy\b/g, "your")
    .replace(/\bam\b/g, "are")
    .replace(/\bI'm\b/g, "you are")
    .replace(/\bwas\b/g, "were")
    .replace(/\bI've\b/g, "you have")
    .replace(/\bI'd\b/g, "you would")
    .replace(/\bI'll\b/g, "you will")
    .replace(/\bmyself\b/g, "yourself");
}

async function sendMessage() {
  const userText = userInput.value.trim();

  if (userText) {
    userInputContainer.style.display = "none";
    chatbox.innerHTML += `<div style="display: flex;"><p>YOU:&nbsp;</p> <p>${userText}</p></div>`;
    userInput.value = "";
    
    const botResponse = getResponse(userText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
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