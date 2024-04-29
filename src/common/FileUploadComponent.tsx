import React, { useState, useContext } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ModalContext } from '../context/ModalContext';
import useChatStore from '../state/chat';
import { ChatMessage } from '../state/chat';
import { dmTelegramMembers } from '../api/dmtelegram';

interface FileUploadComponentProps {
  onFileSelect: (file: File) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onFileSelect,
}) => {
  const { file, setFile, userPass } = useContext(ModalContext);
  const { setShowFileUploadModal, addMessage, currentFunctionArguments } =
    useChatStore((state) => state);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const apikey = localStorage.getItem('telegramApiKey') || '';
      const apihash = localStorage.getItem('telegramApiHash') || '';
      const phone = localStorage.getItem('telegramPhoneNumber') || '';
      if (!selectedFile) throw Error('No file passed!');
      const res = await dmTelegramMembers(
        apikey,
        apihash,
        phone,
        currentFunctionArguments.msg,
        selectedFile
      );
      const newMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: 'Messages Send Successfully',
        timestamp: Date.now(),
      };
      addMessage(newMessage);
      setShowFileUploadModal(false);
    }
  };

  return (
    <Flex align="center" direction="column" w="full" maxW="md" mx="auto">
      <Box>
        {file ? (
          <Text>{file.name} uploaded successfully</Text>
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
        accept=".pdf,.doc,.docx,.jpg,.png,.csv"
        mb={4}
      />
    </Flex>
  );
};

export default FileUploadComponent;
