import React, { useState } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';

interface UpdatePasswordComponentProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
}

const UpdatePasswordComponent: React.FC<UpdatePasswordComponentProps> = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (currentPassword.trim() !== '' && newPassword.trim() !== '') {
      onSubmit(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
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
