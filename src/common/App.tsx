import React, { useState } from 'react';
import { Box, ChakraProvider, Heading, HStack } from '@chakra-ui/react';
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
        {/* {formSubmitted ? (
          <AppUI />
        ) : (
          <FormComponent onFormSubmit={handleFormSubmit} />
        )} */}
        <AppUI/>
      </Box>
    </ChakraProvider>
  );
};

const AppUI: React.FC = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);

  return (
    <>
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
      {openAIKey ? <TaskUI /> : <SetAPIKey />}
    </>
  );
};

export default App;
