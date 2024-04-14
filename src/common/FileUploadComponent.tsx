import React, { useState, useContext } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { ChatMessage } from '../state/chat';
import { sendEmail } from '../api/sendEmail';

interface FileUploadComponentProps {
  onFileSelect: (file: File) => void;
}

 const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileSelect }) => {
  const { file, setFile, userPass } = useContext(ModalContext);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {setShowFileUploadModal, addMessage, currentFunctionArguments} = useChatStore((state) => state)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // const file = e.target.files[0];
      // setSelectedFile(file);
       //onFileSelect(file);
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const csv_file = file;
      if (!csv_file) {
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: 'AI assistant',
          content: "Please attach the csv file with Email field, then type 'Confirm Action'",
          timestamp: Date.now(),
        };
        addMessage(newMessage)
      }
        const res = await sendEmail({
          user_id: currentFunctionArguments.user_id,
          subject: currentFunctionArguments.subject,
          user_pass: userPass,
          msg: currentFunctionArguments.msg,
          csv_file: selectedFile
        });

        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: 'AI assistant',
          content: res,
          timestamp: Date.now(),
        };
        addMessage(newMessage);
      setShowFileUploadModal(false)
    }
  };

  return (
    <Flex align="center">
      <Box>
        {/* {selectedFile ? (
          <Text>{selectedFile.name}</Text> */}
        {file ? (
          <Text>{file.name}</Text>  
        ) : (
          <Button as="label" htmlFor="file-input" colorScheme="blue">
            Choose File
          </Button>
        )}
      </Box>
      <Input
        id="file-input"
        type="file"
        display="none"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
    </Flex>
  );
};

export default FileUploadComponent;