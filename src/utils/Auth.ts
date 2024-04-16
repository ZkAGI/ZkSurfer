import { IProvider } from '@web3auth/base';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import RPC from '../Login/web3RPC';

interface Props {
  web3auth: Web3AuthNoModal | null;
  provider: IProvider | null;
}

export const authenticateUser = async ({ web3auth }: Props) => {
  if (!web3auth) {
    console.log('web3auth not initialized yet');
    return;
  }
  const idToken = await web3auth.authenticateUser();
  return idToken;
};

export const getUserInfo = async (web3auth: Web3AuthNoModal | null) => {
  if (!web3auth) {
    console.log('web3auth not initialized yet');
    return;
  }
  const user = await web3auth.getUserInfo();
  const { email, name, verifier } = user;
  return { email, name, verifier };
};

export const getChainId = async ({ provider }: Props) => {
  if (!provider) {
    console.log('provider not initialized yet');
    return;
  }
  const rpc = new RPC(provider);
  const chainId = await rpc.getChainId();
  return chainId;
};
export const getAccounts = async ({ provider }: Props) => {
  if (!provider) {
    console.log('provider not initialized yet');
    return;
  }
  const rpc = new RPC(provider);
  const address = await rpc.getAccounts();
  return address;
};

export const getBalance = async ({ provider }: Props) => {
  if (!provider) {
    console.log('provider not initialized yet');
    return;
  }
  const rpc = new RPC(provider);
  const balance = await rpc.getBalance();
  return balance;
};

export const sendTransaction = async ({ provider }: Props) => {
  if (!provider) {
    console.log('provider not initialized yet');
    return;
  }
  const rpc = new RPC(provider);
  const receipt = await rpc.sendTransaction();
  return receipt;
};

export const signMessage = async ({ provider }: Props) => {
  if (!provider) {
    console.log('provider not initialized yet');
    return;
  }
  const rpc = new RPC(provider);
  const signedMessage = await rpc.signMessage();
  return signedMessage;
};
