import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { taikoNodeEnvironmentSetup } from '../api/taikoNodeCreation';
import { ChatMessage } from '../state/chat';

// interface CredentialsComponentProps {
//   onSubmit: (password: string, privateKey: string) => void;
// }

//const CredentialsComponent: React.FC<CredentialsComponentProps> = ({ onSubmit }) => {
  const CredentialsComponent = () => {
  const { password, setPassword, privateKey, setPrivateKey } = useContext(ModalContext);
const {setShowCredentialsModal, addMessage, currentFunctionArguments} = useChatStore((state) => state)
  // const [password, setPassword] = useState('');
  // const [privateKey, setPrivateKey] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  };

  const handleSubmit = async () => {
    if (password.trim() !== '' && privateKey.trim() !== '') {
      //onSubmit(password, privateKey);
      // setPassword(password);
      // setPrivateKey(privateKey);
      //console.log("showtest",currentFunctionArguments)
      const res = await taikoNodeEnvironmentSetup({ host: currentFunctionArguments.host, username: currentFunctionArguments.username, password: password });
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res,
        timestamp: Date.now(),
      };
     //set((state) => ({ ...state, history: [...state.history, newMessage] }));
     addMessage(newMessage)
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
