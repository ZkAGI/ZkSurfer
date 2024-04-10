import React, { useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

interface FileUploadComponentProps {
  onFileSelect: (file: File) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <Flex align="center">
      <Box>
        {selectedFile ? (
          <Text>{selectedFile.name}</Text>
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