import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { taikoNodeEnvironmentSetup } from '../api/taikoNodeCreation';

// interface CredentialsComponentProps {
//   onSubmit: (password: string, privateKey: string) => void;
// }

//const CredentialsComponent: React.FC<CredentialsComponentProps> = ({ onSubmit }) => {
  const CredentialsComponent = () => {
  const { password, setPassword, privateKey, setPrivateKey } = useContext(ModalContext);
const {setShowCredentialsModal} = useChatStore((state) => state)
  // const [password, setPassword] = useState('');
  // const [privateKey, setPrivateKey] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  };

  const handleSubmit = () => {
    if (password.trim() !== '' && privateKey.trim() !== '') {
      //onSubmit(password, privateKey);
      // setPassword(password);
      // setPrivateKey(privateKey);

      setShowCredentialsModal(false)
    }
  };

  return (
    <Flex>
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Spacer />
      <Input
        type="password"
        placeholder="Enter private key"
        value={privateKey}
        onChange={handlePrivateKeyChange}
      /><Spacer/>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  );
};

export default CredentialsComponent;
