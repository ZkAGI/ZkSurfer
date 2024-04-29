import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Box, Text } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { taikoNodeEnvironmentSetup } from '../api/taikoNodeCreation';
import { ChatMessage } from '../state/chat';

const CredentialsComponent = () => {
  const { password, setPassword, privateKey, setPrivateKey } =
    useContext(ModalContext);
  const { setShowCredentialsModal, addMessage, currentFunctionArguments } =
    useChatStore((state) => state);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (password.trim() !== '' && privateKey.trim() !== '') {
      const res = await taikoNodeEnvironmentSetup({
        host: currentFunctionArguments.host,
        username: currentFunctionArguments.username,
        password: password,
      });
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
      setIsLoading(false);
      setSubmitted(true);
      setShowCredentialsModal(false);
    }
  };

  return (
    <Flex direction="column" align="center" w="full" maxW="md" mx="auto">
      {submitted ? (
        <div>Submitted</div> 
      ) : (
        <Box p={4}
        backgroundColor="gray.100"
        borderRadius="md"
        boxShadow="md"
        mb={4}>
          <Text mb={4}>Manage Credentials</Text>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            mb={4}
          />
          <Input
            type="password"
            placeholder="Enter private key"
            value={privateKey}
            onChange={handlePrivateKeyChange}
            mb={6}
          />
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            w="full"
            maxW="sm"
            mb={6}
            isLoading={isLoading}
            loadingText="Setting environment..."
          >
            Submit
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default CredentialsComponent;
