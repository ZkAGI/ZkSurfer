import React, { useState, useContext } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { ChatMessage } from '../state/chat';

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