import React, { useState } from 'react';
import { Box, ChakraProvider, Heading, HStack, Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@chakra-ui/react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import FormComponent from '../pages/Popup/FormComponent'; // Import the FormComponent

const App: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = () => {
    setFormSubmitted(true);
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
        <Tabs>
          <TabList>
            <Tab>App</Tab>
            <Tab>Node</Tab> {/* New tab named "Node" */}
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* {formSubmitted ? (
                <AppUI />
              ) : (
                <FormComponent onFormSubmit={handleFormSubmit} />
              )} */}
              <AppUI/>
            </TabPanel>
            <TabPanel>
              {/* Content for the "Node" tab goes here */}
              <Box>
                <Heading as="h2" size="md">Content for Node Tab</Heading>
                <HStack spacing={4} mt={4}>
                  <Button colorScheme="blue">Taiko</Button>
                  <Button colorScheme="green">Aleo</Button>
                </HStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

const AppUI: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);

  return (
    <>
      {openAIKey ? <TaskUI /> : <SetAPIKey />}
    </>
  );
};

export default App;
