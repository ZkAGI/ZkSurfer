import { Groq } from 'groq-sdk';

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
  const model = useAppState.getState().settings.selectedModel;
  const prompt = formatPrompt(taskInstructions, previousActions, simplifiedDOM);
  const key = "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"
  if (!key) {
    notifyError?.('No Groq key found');
    return null;
  }
  const groq = new Groq({
    apiKey: key,
    dangerouslyAllowBrowser: true
});
  const maxSystemMessageLength = 3000; // Choose a reasonable length for the system message
  const truncatedSystemMessage = systemMessage.substring(0, maxSystemMessageLength);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const messages = [
        {
          role: 'system',
          content: truncatedSystemMessage,
        },
        { role: 'user', content: prompt },
      ];
  
      const query = await groq.chat.completions.create({
        model: "mixtral-8x7b-32768",
        messages: messages,
        max_tokens: 500,
        temperature: 0,
        stop: ['</Action>'],
      });
  
      // const response = await query.fetch(key);
  
      return {
        prompt,
        response:
          query.choices[0].message?.content?.trim() + '</Action>',
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