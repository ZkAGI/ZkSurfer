import React, { useState, useCallback, useEffect } from 'react';
import { VStack, HStack, Textarea, useToast, Spacer, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import useChatStore, { ChatMessage } from '../state/chat';
import RunChatButton from './RunChatButton';
import ChatHistory from './ChatHistory';
import { debugMode } from '../constants';
import TaskStatus from './TaskStatus';
import PasswordComponent from './PasswordComponent';
import UpdatePasswordComponent from './UpdatePasswordComponent';
import CredentialsComponent from './CredentialsComponent';

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userPass, setUserPass] = useState('');
  const [fileName, setFileName] = useState<string>('');
  const [isFileAttached, setIsFileAttached] = useState<boolean>(false); // Track if file is attached
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState<boolean>(false); // State to control Update Password modal
  const [showCredentialsModal, setShowCredentialsModal] = useState<boolean>(false); // State to control Credentials modal
  const [currentPassword, setCurrentPassword] = useState<string>(''); // State to store current password
  const [newPassword, setNewPassword] = useState<string>(''); // State to store new password
  const [password, setPassword] = useState<string>(''); // State to store password
  const [privateKey, setPrivateKey] = useState<string>(''); // State to store private key

  const { history, addMessage, generateChat, showPasswordModal, setShowPasswordModal } = useChatStore();
  const toast = useToast();

  useEffect(() => {
    const defaultMessage: ChatMessage = {
      id: Date.now(),
      sender: 'AI assistant',
      content: 'Hello, how can I help you?',
      timestamp: Date.now(),
    };
    addMessage(defaultMessage);
  }, []);

  const toastError = useCallback(
    (message: string) => {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage: ChatMessage = {
      id: history.length + 1,
      sender: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    addMessage(newMessage);
    generateChat(message.trim(), file, userPass, currentPassword, newPassword, password, privateKey);
    setMessage('');
    setFile(null);
    setFileName('');
    setIsFileAttached(false); // Clear file attachment status
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsFileAttached(true); // Set file attachment status
    }
  };

  useEffect(() => {
    const chatHistoryElement = document.getElementById('chat-history');
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
  }, [history]);

  const hidePasswordInput = () => {
    setShowPasswordModal(false);
  };

  return (
    <>
      <Modal isOpen={showPasswordModal} onClose={hidePasswordInput}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PasswordComponent onSubmit={setUserPass} onFileSelect={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={hidePasswordInput}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Password Modal */}
      <Modal isOpen={showUpdatePasswordModal} onClose={() => setShowUpdatePasswordModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdatePasswordComponent onSubmit={(currentPassword, newPassword) => {
              setCurrentPassword(currentPassword);
              setNewPassword(newPassword);
            }} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setShowUpdatePasswordModal(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Credentials Modal */}
      <Modal isOpen={showCredentialsModal} onClose={() => setShowCredentialsModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Credentials</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CredentialsComponent onSubmit={(password, privateKey) => {
              setPassword(password);
              setPrivateKey(privateKey);
            }} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setShowCredentialsModal(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ChatHistory messages={history} />
      <Textarea
        autoFocus
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={false}
        mb={2}
        onKeyDown={onKeyDown}
      />
      <HStack mt={2}>
        {isFileAttached && <span>{fileName}</span>}
      </HStack>
      <HStack mt={2}>
        <RunChatButton sendMessage={handleSendMessage} />
        <Spacer />
        {debugMode && <TaskStatus />}
      </HStack>

    </>
  );
};

export default ChatUI;
