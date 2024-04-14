import React, { useState ,useContext} from 'react';
import { Input, Button, Flex, Spacer } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { ChatMessage } from '../state/chat';
import { sendEmail } from '../api/sendEmail';

// interface PasswordComponentProps {
//   //onSubmit: (password: string) => void;
//   //onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; // Update the type
// }

//const PasswordComponent: React.FC<PasswordComponentProps> = ({ onSubmit, onFileSelect }) => {
  const PasswordComponent = () => {
  //const { setUserPass } = useContext(ModalContext);
  //const [password, setPassword] = useState('');
  const { password, setPassword, setUserPass, setFile, file } = useContext(ModalContext);
  const {setShowPasswordModal,addMessage, currentFunctionArguments} = useChatStore((state) => state)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // setFileName(selectedFile.name);
      // setIsFileAttached(true); // Set file attachment status
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPass(password)
    const csv_file = file;
    console.log("csv check",csv_file)
    if (!csv_file) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: "Please attach the csv file with Email field, then type 'Confirm Action'",
        timestamp: Date.now(),
      };
      addMessage(newMessage)
    }
    if(!file) throw Error("No file passed!")
      const res = await sendEmail({
        user_id: currentFunctionArguments.user_id,
        subject: currentFunctionArguments.subject,
        user_pass: password,
        msg: currentFunctionArguments.msg,
        csv_file: file 
      });

      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
    setShowPasswordModal(false)
  };

  return (
    <Flex>
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Spacer />
      {/* Attach File button */}
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange} // Update the event handler here
        id="attach-file-input"
      />
      <label htmlFor="attach-file-input">
        <Button colorScheme="blue" as="span">
          Attach File
        </Button>
      </label>
      <Spacer />
      {/* Submit button */}
      <Button colorScheme="blue" onClick={handleChange as any} >
        Submit
      </Button>
    </Flex>
  );
};

export default PasswordComponent;
