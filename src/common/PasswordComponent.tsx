import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Spacer, Box } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { ChatMessage } from '../state/chat';
import { sendEmail } from '../api/sendEmail';

const PasswordComponent = () => {
  const { password, setPassword, setUserPass, setFile, file } =
    useContext(ModalContext);
  const { setShowPasswordModal, addMessage, currentFunctionArguments } =
    useChatStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPass(password);
    const csv_file = file;
    console.log('csv check', csv_file);
    if (!csv_file) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content:
          "Please attach the csv file with Email field, then type 'Confirm Action'",
        timestamp: Date.now(),
      };
      addMessage(newMessage);
    }
    if (!file) throw Error('No file passed!');
    setIsLoading(true);
    try{
      const res = await sendEmail({
        user_id: currentFunctionArguments.user_id,
        subject: currentFunctionArguments.subject,
        user_pass: password,
        msg: currentFunctionArguments.msg,
        csv_file: file,
      });
  
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
    }catch(error){
      console.error(error)
    }finally{
      setIsLoading(false); 
      setShowPasswordModal(false);
    }
  };

  return (
    <Flex direction="column" align="center" w="full" maxW="md" mx="auto">
      <Input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={4}
      />
      <Box w="full" mb={6}>
        <Flex>
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            id="attach-file-input"
          />
          <Button
            colorScheme="blue"
            as="label"
            htmlFor="attach-file-input"
            flex="1"
          >
            Attach File
          </Button>
        </Flex>
      </Box>
      <Button colorScheme="blue" onClick={handleChange as any} mb={4} isLoading={isLoading}  loadingText="Sending email...">
        Submit
      </Button>
    </Flex>
  );
};

export default PasswordComponent;
