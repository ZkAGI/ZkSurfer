import { merge } from 'lodash';
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createCurrentTaskSlice, CurrentTaskSlice } from './currentTask';
import { createUiSlice, UiSlice } from './ui';
import { createSettingsSlice, SettingsSlice } from './settings';
import useChatStore, { ChatState } from './chat'; // Import chat slice

export type StoreType = {
  currentTask: CurrentTaskSlice;
  ui: UiSlice;
  settings: SettingsSlice;
  chat: ChatState; // Update chat type to ChatState
};

export type MyStateCreator<T> = StateCreator<
  StoreType,
  [['zustand/immer', never]],
  [],
  T
>;

// Define a function to create the chat slice state
const createChatSlice = () => useChatStore.getState();

export const useAppState = create<StoreType>()(
  persist(
    immer(
      devtools((...a) => ({
        currentTask: createCurrentTaskSlice(...a),
        ui: createUiSlice(...a),
        settings: createSettingsSlice(...a),
        chat: createChatSlice(), // Use the function to create chat slice
      }))
    ),
    {
      name: 'app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ui: {
          instructions: state.ui.instructions,
        },
        settings: {
          openAIKey: state.settings.openAIKey,
          selectedModel: state.settings.selectedModel,
        },
        chat: {
          history: state.chat.history,
          // Add other chat-related properties to persist if needed
        },
      }),
      merge: (persistedState, currentState) =>
        merge(currentState, persistedState),
    }
  )
);

// @ts-expect-error used for debugging
window.getState = useAppState.getState;
