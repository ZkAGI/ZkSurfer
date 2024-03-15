import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, Heading, HStack, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Input } from '@chakra-ui/react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import ChatUI from './ChatUI';
import LoginComponent from '../Login/LoginComponent';

const App: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  useEffect(() => {
    // Check local storage to see if the user has already logged in
    const isUserLoggedIn = localStorage.getItem('userLoggedIn');
    if (isUserLoggedIn==='true') {
      console.log(isUserLoggedIn)
      setLoggedIn(true);
    }else{
      setLoggedIn(false)
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.setItem('userLoggedIn', 'false');
    setLoggedIn(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    // Call the parent component callback with the selected file and message
    
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
            {loggedIn ?(
            <Button
      onClick={handleLogout}
      colorScheme="red"
    >
      Logout
    </Button>):NaN}
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
