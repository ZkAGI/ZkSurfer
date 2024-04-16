import React, { useState } from 'react';

import { useAuthStore } from '../context/NotifyContext';
import {
  getUserInfo,
  authenticateUser,
  getChainId,
  getAccounts,
  getBalance,
  signMessage,
  sendTransaction,
} from '../utils/Auth';
import { Box, Button, Text } from '@chakra-ui/react';

interface ButtonData {
  [key: string]: { heading: string };
}

const LoggedInViewComponent = () => {
  const { web3auth, provider } = useAuthStore();
  const [loggedValue, setLoggedValue] = useState<{
    value: any;
    button: string | null;
    heading: string;
  }>({ value: null, button: null, heading: '' });

  const buttonData: ButtonData = {
    getUserInfo: {
      heading: 'User Information',
    },
    getChainId: {
      heading: 'Chain ID',
    },
    getAccounts: {
      heading: 'Accounts',
    },
    getBalance: {
      heading: 'Balance',
    },
  };

  const handleButtonClick = async (button: string, operation: string) => {
    let value;
    switch (operation) {
      case 'getUserInfo':
        value = await getUserInfo(web3auth);
        setLoggedValue({
          value,
          button,
          heading: buttonData[button]?.heading || 'Default Heading',
        });
        break;
      case 'authenticateUser':
        value = await authenticateUser({ web3auth, provider });
        break;
      case 'getChainId':
        value = await getChainId({ provider, web3auth });
        break;
      case 'getAccounts':
        value = await getAccounts({ provider, web3auth });
        break;
      case 'getBalance':
        value = await getBalance({ provider, web3auth });
        break;
      case 'signMessage':
        value = await signMessage({ provider, web3auth });
        break;
      case 'sendTransaction':
        value = await sendTransaction({ provider, web3auth });
        break;
      default:
        break;
    }
    setLoggedValue({
      value,
      button,
      heading: buttonData[button]?.heading || 'Default Heading',
    });
  };

  const handleBackButton = () => {
    setLoggedValue({ value: null, button: null, heading: '' });
  };

  return (
    <div className="flex-container">
      {loggedValue.button === null ? (
        <>
          <div>
            <button
              onClick={() => handleButtonClick('getUserInfo', 'getUserInfo')}
              className="card"
            >
              Get User Info
            </button>
          </div>
          {/* <div>
        <button onClick={() => handleButtonClick('getIdToken', 'authenticateUser')} className="card">
          Get ID Token
        </button>
      </div> */}
          <div>
            <button
              onClick={() => handleButtonClick('getChainId', 'getChainId')}
              className="card"
            >
              Get Chain ID
            </button>
          </div>
          <div>
            <button
              onClick={() => handleButtonClick('getAccounts', 'getAccounts')}
              className="card"
            >
              Get Accounts
            </button>
          </div>
          <div>
            <button
              onClick={() => handleButtonClick('getBalance', 'getBalance')}
              className="card"
            >
              Get Balance
            </button>
          </div>
          {/* <div>
        <button onClick={() =>  handleButtonClick('signMessage', 'signMessage')} className="card">
          Sign Message
        </button>
      </div>
      <div>
        <button onClick={() =>  handleButtonClick('sendTransaction', 'sendTransaction')} className="card">
          Send Transaction
        </button>
      </div> */}
        </>
      ) : (
        <Box bg="white" p={4} borderRadius="md" boxShadow="md" width="full">
          {loggedValue.button === 'getUserInfo' ? (
            <Box textAlign="left">
              <Text size="md" mb={4}>
                {loggedValue.heading}
              </Text>
              <Text>
                email: {loggedValue.value.email}
                <br />
                name: {loggedValue.value.name}
                <br />
                verifier: {loggedValue.value.verifier}
                <br />
              </Text>
            </Box>
          ) : (
            <div>
              {loggedValue.heading}:{' '}
              {JSON.stringify(loggedValue.value).replace(/"/g, '')}
            </div>
          )}
          <Button colorScheme="blue" mt={6} onClick={handleBackButton}>
            Back
          </Button>
        </Box>
      )}
    </div>
  );
};

export default LoggedInViewComponent;
