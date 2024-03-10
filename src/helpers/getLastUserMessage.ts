import { ChatMessage } from '../state/chat';

// Assuming `history` is an array of ChatMessage objects
const getLastUserMessage = (history: ChatMessage[]): ChatMessage | undefined => {
  // Iterate over the chat history in reverse order
  for (let i = history.length - 1; i >= 0; i--) {
    // Check if the sender of the message is the user
    if (history[i].sender === 'user') {
        console.log(history[i]);
      return history[i]; // Return the last user message found
    }
  }
  return undefined; // Return undefined if no user message is found in history
};

export default getLastUserMessage;
