import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { taikoNodeEnvironmentSetup } from '../api/taikoNodeCreation';
import { ChatMessage } from '../state/chat';

const CredentialsComponent = () => {
  const { password, setPassword, privateKey, setPrivateKey } =
    useContext(ModalContext);
  const { setShowCredentialsModal, addMessage, currentFunctionArguments } =
    useChatStore((state) => state);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  };

  const handleSubmit = async () => {
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
      setShowCredentialsModal(false);
    }
  };

  return (
    <Flex direction="column" align="center" w="full" maxW="md" mx="auto">
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
      <Button colorScheme="blue" onClick={handleSubmit} w="full" maxW="sm" mb={6}>
        Submit
      </Button>
    </Flex>
  );
};

export default CredentialsComponent;
