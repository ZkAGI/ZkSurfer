import React, { useEffect, useState } from 'react';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import {
  OpenloginAdapter,
  OpenloginUserInfo,
} from '@web3auth/openlogin-adapter';
import './login.css';
import { useAuthStore } from '../context/NotifyContext';
import { Box, Flex, Button, Heading, Text } from '@chakra-ui/react';

const clientId =
  'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ'; // get from https://dashboard.web3auth.io
interface LoginComponentProps {
  onLogin: () => void; // Add a type for the onLogin prop
}
function LoginComponent({ onLogin }: LoginComponentProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // Modify here
  const [isFullPage, setIsFullPage] = useState(false);
  const { web3auth, setWeb3Auth, provider, setProvider } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: '0x1', // Please use 0x1 for Mainnet
          rpcTarget: 'https://rpc.ankr.com/eth',
          displayName: 'Ethereum Mainnet',
          blockExplorerUrl: 'https://etherscan.io/',
          ticker: 'ETH',
          tickerName: 'Ethereum',
          logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3auth = new Web3AuthNoModal({
          clientId:
            'BP_vYOMN--pogDqBiyO30wS7QijQr9_STFuQVhVf6CAhm5BMGkjrR4dX7CAbxpuSf64TIBes_DARD3y9NLxQHkU',
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });
        console.log(web3auth);

        const openloginAdapter = new OpenloginAdapter({});
        web3auth.configureAdapter(openloginAdapter);

        setWeb3Auth(web3auth);

        await web3auth.init();
        setProvider(web3auth.provider);
      } catch (error) {
        console.error(error);
      }
    };

    init();

    if (window.innerWidth > 400) setIsFullPage(true);
  }, []);

  const login = async () => {
    setIsLoading(true);
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: 'google',
        }
      );
      setProvider(web3authProvider);
      setLoggedIn(true); // Set loggedIn to true after successful login
      localStorage.setItem('userLoggedIn', 'true');
      onLogin();
    } catch (error) {
      console.log('Error in loggin in', error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const unloggedInView = (
    <>
      {!isFullPage ? (
        <Button
          onClick={() => chrome.tabs.create({ url: 'index.html' })}
          size="lg"
          isLoading={isLoading}
          loadingText="Connecting Wallet..."
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          onClick={login}
          size="lg"
          colorScheme="blue"
          isLoading={isLoading}
          loadingText="Connecting Wallet..."
        >
          Connect Wallet
        </Button>
      )}
    </>
  );

  return (
    <Flex minH="20vh" align="center" justify="center" direction="column">
      <Box bg="white" p={2} maxW="lg" textAlign="center">
        <Text mb={6}>
          End-user digital assistant product for on-chain and off-chain
          automation
        </Text>
        {!loggedIn ? unloggedInView : null}
      </Box>
    </Flex>
  );
}

export default LoginComponent;
