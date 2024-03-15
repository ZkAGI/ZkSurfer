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
      setLoggedIn(true);
    }else{
      setLoggedIn(false)
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
              ZkSurf
            </Heading>
            <HStack spacing={2}>
              <ModelDropdown />
              <OptionsDropdown />
            </HStack>
          </HStack>
        </Box>
        
              {loggedIn ? (
              <Tabs>
  <TabList>
    <Tab>Browser Automation</Tab>
    <Tab>Chat</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <AppUI />
    </TabPanel>
   
    <TabPanel>
      <ChatUI/>
    </TabPanel>
  </TabPanels>
</Tabs>

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
