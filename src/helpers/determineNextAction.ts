import { useAppState } from '../state/store';
import { availableActions } from './availableActions';
import { ParsedResponseSuccess } from './parseResponse';

const formattedActions = availableActions
  .map((action, i) => {
    const args = action.args
      .map((arg) => `${arg.name}: ${arg.type}`)
      .join(', ');
    return `${i + 1}. ${action.name}(${args}): ${action.description}`;
  })
  .join('\n');


const systemMessage = `
You are a browser automation assistant.

You can use the following tools:

${formattedActions}

You will be given a task to perform and the current state of the DOM. You will also receive previous actions. You may retry a failed action up to once.

This is an example of an action:

<Thought>I should click the add to cart button</Thought>
<Action>click(223)</Action>

Always include the <Thought> and <Action> open/close tags, or your response will be marked as invalid.
`;

export async function determineNextAction(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  simplifiedDOM: string,
  maxAttempts = 3,
  notifyError?: (error: string) => void
) {
  // const model = useAppState.getState().settings.selectedModel;
  const prompt = formatPrompt(taskInstructions, previousActions, simplifiedDOM);
  const max_tokens= 500
  const temperature= 0
  const stop= ['</Action>']
  const maxSystemMessageLength = 3000; // Choose a reasonable length for the system message
  const truncatedSystemMessage = systemMessage.substring(0, maxSystemMessageLength);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const model="hermes-2-pro-mistral"
      const messages = [
        {
          role: 'system',
          content: truncatedSystemMessage,
        },
        { role: 'user', content: prompt },
      ];
  
      const apiEndpoint = 'http://164.52.213.234:8080/v1/chat/completions'; // Replace with your own API endpoint
      console.log(JSON.stringify({model,messages,temperature,max_tokens,stop}))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          // "x-api-key": "fa6c49ffa6f0e925b8b87795122109c1",
          'Content-Type': 'application/json',},
          body: JSON.stringify({ model,messages,temperature,max_tokens,stop }),
      }
      );
      // const response = await fetch(apiEndpoint, requestOptions as RequestInit);

      const data = await response.json();
      console.log(data)
      return {
        prompt,
        response:
          data.choices[0].message?.content?.trim() + '</Action>',
      };
    } catch (error: any) {
      console.log('determineNextAction error', error);
      if (error.response.data.error.message.includes('server error')) {
        // Problem with the Groq API, try again
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

export function formatPrompt(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  pageContents: string
) {
  let previousActionsString = '';

  const maxPreviousActionsLength = 3000; // Choose a reasonable length
  if (previousActions.length > 0) {
    const serializedActions = previousActions
      .map(
        (action) =>
          // `<Thought>${action.thought}</Thought>\n<Action>${action.action}</Action>`
          `<Action>${action.action}</Action>`
      )
      .join('\n\n');
    previousActionsString = `You have already taken the following actions: \n${serializedActions}\n\n`;
    
    if (previousActionsString.length > maxPreviousActionsLength) {
      previousActionsString = previousActionsString.substring(0, maxPreviousActionsLength);
    }
  }

  return `The user requests the following task:

${taskInstructions}

${previousActionsString}

Current time: ${new Date().toLocaleString()}

Current page contents:
${pageContents}`;
}