import { create } from 'zustand';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { IProvider } from '@web3auth/base';

interface NotifyContextValue {
  web3auth: Web3AuthNoModal | null;
  setWeb3Auth: (auth: Web3AuthNoModal) => void;
  provider: IProvider | null;
  setProvider: (prov: IProvider | null) => void;
}

export const useAuthStore = create<NotifyContextValue>((set) => ({
  web3auth: null,
  setWeb3Auth: (auth: Web3AuthNoModal) => set((state) => ({ web3auth: auth })),
  provider: null,
  setProvider: (prov: IProvider | null) => set((state) => ({ provider: prov })),
}));
