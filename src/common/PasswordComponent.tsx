import React, { useState ,useContext} from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';

interface PasswordComponentProps {
  //onSubmit: (password: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; // Update the type
}

//const PasswordComponent: React.FC<PasswordComponentProps> = ({ onSubmit, onFileSelect }) => {
  const PasswordComponent: React.FC<PasswordComponentProps> = ({  onFileSelect }) => {

  //const { setUserPass } = useContext(ModalContext);
  //const [password, setPassword] = useState('');
  const { password, setPassword, setUserPass } = useContext(ModalContext);
  const {setShowPasswordModal} = useChatStore((state) => state)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowPasswordModal(false)
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
      <Button colorScheme="blue" onClick={() => setUserPass(password)}>
        Submit
      </Button>
    </Flex>
  );
};

export default PasswordComponent;
