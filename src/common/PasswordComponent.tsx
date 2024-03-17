import React, { useState } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';

interface PasswordComponentProps {
  onSubmit: (password: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; // Update the type
}

const PasswordComponent: React.FC<PasswordComponentProps> = ({ onSubmit, onFileSelect }) => {
  const [password, setPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Flex>
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handleChange}
      />
      <Spacer />
      {/* Attach File button */}
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={onFileSelect} // Update the event handler here
        id="attach-file-input"
      />
      <label htmlFor="attach-file-input">
        <Button colorScheme="blue" as="span">
          Attach File
        </Button>
      </label>
      <Spacer />
      {/* Submit button */}
      <Button colorScheme="blue" onClick={() => onSubmit(password)}>
        Submit
      </Button>
    </Flex>
  );
};

export default PasswordComponent;
