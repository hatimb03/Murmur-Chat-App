const messages = [
  "Start a conversation and let the words flow.",
  "Every great friendship begins with a simple hello.",
  "No messages yet? Your next chat could be the start of something wonderful.",
  "Pick someone to chat with and brighten their day!",
  "A conversation is a bridge between hearts. Who will you connect with today?",
];

export function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
