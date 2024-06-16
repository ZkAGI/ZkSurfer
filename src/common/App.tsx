import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  ChakraProvider,
  Heading,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Input,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import ChatUI from './ChatUI';
import LoginComponent from '../Login/LoginComponent';
import { ModalProvider } from '../context/ModalContext';
import LoggedInViewComponent from '../Login/LoggenInViewComponent';
import { FaCircleInfo } from 'react-icons/fa6';

const App: React.FC = () => {
  const zynapseKey = useAppState((state) => state.settings.zynapseKey);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check local storage to see if the user has already logged in
    const isUserLoggedIn = localStorage.getItem('userLoggedIn');
    if (isUserLoggedIn === 'true') {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.setItem('userLoggedIn', 'false');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('openlogin_store');
    setLoggedIn(false);
  };
  const handleLogin = () => {
    setLoggedIn(true);
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
  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };

  return (
    <ChakraProvider>
      <Box p="8" fontSize="lg" w="full">
        <Box mb={4}>
          <HStack mb={4} alignItems="center">
            <img
              src={logo}
              width={32}
              height={20}
              className="App-logo"
              alt="logo"
            />
            <Heading as="h1" size="lg" flex={1}>
              ZkSurfer
            </Heading>
            {loggedIn ? (
              <Flex direction="row" mx="auto">
                <Button mr="2" onClick={toggleModal}>
                  <FaCircleInfo />
                </Button>
                <Button onClick={handleLogout} colorScheme="red">
                  Logout
                </Button>
              </Flex>
            ) : (
              NaN
            )}
            <HStack spacing={2}>
              <ModelDropdown />
              <OptionsDropdown />
            </HStack>
          </HStack>
        </Box>

        {loggedIn ? (
          <Tabs>
            <TabList>
              {/* <Tab>Browser Automation</Tab> */}
              <Tab>Chat</Tab>
            </TabList>
            <TabPanels>
              {/* <TabPanel>
                <AppUI />
              </TabPanel> */}

              <TabPanel>
                <ModalProvider>
                  <ChatUI />
                </ModalProvider>
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <LoginComponent onLogin={handleLogin} />
        )}

        <Modal isOpen={showModal} onClose={toggleModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <LoggedInViewComponent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

const AppUI: React.FC = () => {
  const zynapseKey = useAppState((state) => state.settings.zynapseKey);

  return (
    <>
      {/* {zynapseKey ? <TaskUI /> : <SetAPIKey />} */}
      <TaskUI />
    </>
  );
};

export default App;
