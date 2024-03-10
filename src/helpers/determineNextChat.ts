import { Groq } from 'groq-sdk';

import { availableActions } from './availableChatActions';

const formattedActions = availableActions
  .map((action, i) => {
    const args = action.args
      .map((arg) => `${arg.name}: ${arg.type}`)
      .join(', ');
    return `${i + 1}. ${action.name}(${args}): ${action.description}`;
  })
  .join('\n');

export async function determineNextChat(
  taskInstructions: string,
  maxAttempts = 3,
  notifyError?: (error: string) => void
) {
  const key = "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";
  if (!key) {
    notifyError?.('No Groq key found');
    return null;
  }
  const groq = new Groq({
    apiKey: key,
    dangerouslyAllowBrowser: true
  });

  const systemMessage = `
    You are a AI assistant.
    You can use the following tool

     ${formattedActions}
     This is an example of an action:
      
      <Action>taikoNodeEnvironmentSetup('192.162.2.1','root','admin123')</Action>

      Response Should only contain what input we need from user and response should be short
     
  `;

  const apiEndpoint = 'https://leo.tektorch.info/chat/completions'; // Replace with your own API endpoint
  // const apiEndpoint = 'https://ad04-164-52-213-234.ngrok-free.app/api/chat'; // Replace with your own API endpoint

  const maxSystemMessageLength = 3000; // Choose a reasonable length for the system message
  const truncatedSystemMessage = systemMessage.substring(0, maxSystemMessageLength);
  // const FETCH_TIMEOUT = 60000; // 60 seconds
  interface CustomRequestInit extends RequestInit {
    timeout?: number;
  }

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const messages = [
        {
          role: "user",
          content: taskInstructions+" "+truncatedSystemMessage
        }
      ]
      console.log(JSON.stringify({messages }))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',},
          body: JSON.stringify({ messages }),
      }
      );
      // const response = await fetch(apiEndpoint, requestOptions as RequestInit);

      const data = await response.json();
      console.log(data);

      return {
        usage: data.usage, // Replace with your own API response format
        prompt,
        response: data[0].content, // Replace with your own API response format
      };
    } catch (error: any) {
      console.log('determineNextAction error', error);
      if (error.response.data.error.message.includes('server error')) {
        // Problem with the API, try again
        if (notifyError) {
          notifyError(error.response.data.error.message);
        }
      } else {
        // Another error, give up
        throw new Error(error.response.data.error.message);
      }
    }
  }
  throw new Error(
    `Failed to complete query after ${maxAttempts} attempts. Please try again later.`
  );

}
