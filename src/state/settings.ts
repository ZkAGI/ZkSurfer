import { MyStateCreator } from './store';

export type SettingsSlice = {
  zynapseKey: string | null;
  selectedModel: string;
  actions: {
    update: (values: Partial<SettingsSlice>) => void;
  };
};
export const createSettingsSlice: MyStateCreator<SettingsSlice> = (set) => ({
  zynapseKey: null,
  selectedModel: 'mistral',
  actions: {
    update: (values) => {
      set((state) => {
        state.settings = { ...state.settings, ...values };
      });
    },
  },
});
