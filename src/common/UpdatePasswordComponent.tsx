import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { changeNodePassword } from '../api/changeNodePassword';
import { ChatMessage } from '../state/chat';

const UpdatePasswordComponent = () => {
  const { currentPassword, setCurrentPassword, newPassword, setNewPassword } =
    useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const { setShowUpdatePasswordModal, addMessage, currentFunctionArguments } =
    useChatStore((state) => state);
  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (currentPassword.trim() !== '' && newPassword.trim() !== '') {
      const res = await changeNodePassword({
        host: currentFunctionArguments.host,
        username: currentFunctionArguments.username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
      setShowUpdatePasswordModal(false);
    }
  };

  return (
    <Flex direction="column" align="center" w="full" maxW="md" mx="auto">
      <Input
        type="password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={handleCurrentPasswordChange}
        mb={4}
      />
      <Input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={handleNewPasswordChange}
        mb={6}
      />
      <Button colorScheme="blue" onClick={handleSubmit} mb={4} isLoading={isLoading}  loadingText="Updating password ...">
        Update Password
      </Button>
    </Flex>
  );
};

export default UpdatePasswordComponent;
