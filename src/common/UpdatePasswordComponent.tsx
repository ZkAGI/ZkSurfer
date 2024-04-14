import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { changeNodePassword } from '../api/changeNodePassword';
import { ChatMessage } from '../state/chat';

// interface UpdatePasswordComponentProps {
//   onSubmit: (currentPassword: string, newPassword: string) => void;
// }

//const UpdatePasswordComponent: React.FC<UpdatePasswordComponentProps> = ({ onSubmit }) => {
const UpdatePasswordComponent = () => {

  const { currentPassword, setCurrentPassword, newPassword, setNewPassword } = useContext(ModalContext);

  // const [currentPassword, setCurrentPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');

  const {setShowUpdatePasswordModal, addMessage, currentFunctionArguments} = useChatStore((state) => state)
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (currentPassword.trim() !== '' && newPassword.trim() !== '') {
      //onSubmit(currentPassword, newPassword);
      //setCurrentPassword(currentPassword);
      //setNewPassword(newPassword);
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
      addMessage(newMessage)
      setShowUpdatePasswordModal(false)
    }
  };

  return (
    <Flex>
      <Input
        type="password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={handleCurrentPasswordChange}
      />
      <Spacer />
      <Input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={handleNewPasswordChange}
      />
      <Spacer />
      <Button colorScheme="blue" onClick={handleSubmit}>
        Update Password
      </Button>
    </Flex>
  );
};

export default UpdatePasswordComponent;
