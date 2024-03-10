// import { sendMessageToTelegram } from './telegramAPI'; // Import the function to send messages to Telegram

import { taikoNodeEnvironmentSetup } from "../api/taikoNodeCreation";

export const chatActions = {
//   sendMessageToTelegram,
taikoNodeEnvironmentSetup,
} as const;

export type ChatActions = typeof chatActions;
type ChatActionName = keyof ChatActions;
type ChatActionPayload<T extends ChatActionName> = Parameters<ChatActions[T]>[0];

export const callChatAction = async <T extends ChatActionName>(
  type: T,
  payload: ChatActionPayload<T>
): Promise<void> => {
  await chatActions[type](payload);
};
