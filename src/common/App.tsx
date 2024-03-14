import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, Heading, HStack, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Input } from '@chakra-ui/react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import FormComponent from '../pages/Popup/FormComponent'; // Import the FormComponent
import ChatUI from './ChatUI';
import LoginComponent from '../Login/LoginComponent';

const App: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage to see if the user has already logged in
    const isUserLoggedIn = localStorage.getItem('userLoggedIn');
    if (isUserLoggedIn) {
      setFormSubmitted(true);
    }
  }, []);

  const handleFormSubmit = () => {
    // Set the flag in local storage indicating that the user has logged in
    localStorage.setItem('userLoggedIn', 'true');
    setFormSubmitted(true);
    console.log('Form submitted:', formSubmitted);
  };


 

  return (
    <ChakraProvider>
      <Box p="8" fontSize="lg" w="full">
        <Box mb={4}>
          <HStack mb={4} alignItems="center">
            <img
              src={logo}
              width={32}
              height={32}
              className="App-logo"
              alt="logo"
            />
            <Heading as="h1" size="lg" flex={1}>
              Autosurf
            </Heading>
            <HStack spacing={2}>
              <ModelDropdown />
              <OptionsDropdown />
            </HStack>
          </HStack>
        </Box>
        
              {/* {loggedIn ? ( */}
              <Tabs>
  <TabList>
    <Tab>App</Tab>
    <Tab>Node</Tab> {/* New tab named "Node" */}
    <Tab>Chat</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <AppUI />
    </TabPanel>
    <TabPanel>
      {/* Content for the "Node" tab goes here */}
      <Box>
        {step === 1 && (
          <>
            <Heading as="h2" size="md">Step 1: Change Password</Heading>
            <Input placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <Input placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button colorScheme="blue" onClick={handleChangePassword} disabled={loading}>
              {loading ? 'Loading...' : 'Change Password'}
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Heading as="h2" size="md">Step 2: Setup Environment</Heading>
            <Button colorScheme="blue" onClick={handleSetupEnvironment} disabled={loading}>
              {loading ? 'Loading...' : 'Setup Environment'}
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Heading as="h2" size="md">Step 3: Pass Key and Data</Heading>
            <Input placeholder="L1 HTTP endpoint" value={L1_ENDPOINT_HTTP} onChange={(e) => setL1_ENDPOINT_HTTP(e.target.value)} />
            <Input placeholder="L1 WS endpoint" value={L1_ENDPOINT_WS} onChange={(e) => setL1_ENDPOINT_WS(e.target.value)} />
            <Input placeholder="Enable proposer (true/false)" value={ENABLE_PROPOSER} onChange={(e) => setENABLE_PROPOSER(e.target.value)} />
            {ENABLE_PROPOSER === "true" && (
              <>
                <Input placeholder="L1 proposer private key" value={L1_PROPOSER_PRIVATE_KEY} onChange={(e) => setL1_PROPOSER_PRIVATE_KEY(e.target.value)} />
                <Input placeholder="Propose block gas limit" value={PROPOSE_BLOCK_TX_GAS_LIMIT} onChange={(e) => setPROPOSE_BLOCK_TX_GAS_LIMIT(e.target.value)} />
                <Input placeholder="Block proposal fee" value={BLOCK_PROPOSAL_FEE} onChange={(e) => setBLOCK_PROPOSAL_FEE(e.target.value)} />
              </>
            )}
            <Button colorScheme="blue" onClick={handleNodesetup} disabled={loading}>
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </>
        )}
        {step === 4 && (
          <>
            <Heading as="h2" size="md">Step 4: Setup Dashboard</Heading>
            <Button colorScheme="blue" onClick={handleSetupDashboard} disabled={loading}>
              {loading ? 'Loading...' : 'Setup Dashboard'}
            </Button>
          </>
        )}
        {step === 5 && (
          // Success message
          <Heading as="h2" size="md">{successMessage}</Heading>
        )}
      </Box>
    </TabPanel>
    <TabPanel>
      <ChatUI/>
    </TabPanel>
  </TabPanels>
</Tabs>
{loggedIn ? (
  <LogoutComponent />
) : (
  <LoginComponent />
)}

      </Box>
    </ChakraProvider>
  );
};

const AppUI: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);

  return (
    <>
      {/* {openAIKey ? <TaskUI /> : <SetAPIKey />} */}
      <TaskUI />
    </>
  );
};

export default App;
