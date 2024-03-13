
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
  

  const systemMessage = `
  You are an AI assistant.
  You can use the following tool

  1. Change Node Password(host: string, username: string, currentPassword: string, newPassword: string): Change the password for a node
  2. Setup Taiko Node Environment(host: string, username: string, password: string): Setup Taiko node environment
  3. Setup Taiko Node and Dashboard(host: string, username: string, password: string, L1_ENDPOINT_HTTP: string, L1_ENDPOINT_WS: string, ENABLE_PROPOSER: boolean, L1_PROPOSER_PRIVATE_KEY: string, PROPOSE_BLOCK_TX_GAS_LIMIT: number, BLOCK_PROPOSAL_FEE: number): Setup Taiko node and dashboard
  You should ask user to enter required parameters for the function they ask for
  You should return response in this format <Action>taikoNodeEnvironmentSetup('192.162.2.1','root','admin123')</Action> only if the user gives all params for action

  `;
  // <Action>taikoNodeEnvironmentSetup('192.162.2.1','root','admin123')</Action>

  // const apiEndpoint = 'https://leo.tektorch.info/chat/completions'; // Replace with your own API endpoint
  const apiEndpoint = 'http://164.52.213.234:8080/api/chat'; // Replace with your own API endpoint

  const maxSystemMessageLength = 3000; // Choose a reasonable length for the system message
  const truncatedSystemMessage = systemMessage.substring(0, maxSystemMessageLength);
 

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const model="mistral"
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
          body: JSON.stringify({model, messages }),
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
