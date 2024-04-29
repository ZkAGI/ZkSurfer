import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  VStack,
  HStack,
  Textarea,
  useToast,
  Spacer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import useChatStore, { ChatMessage } from '../state/chat';
import RunChatButton from './RunChatButton';
import ChatHistory from './ChatHistory';
import { debugMode } from '../constants';
import TaskStatus from './TaskStatus';
import PasswordComponent from './PasswordComponent';
import UpdatePasswordComponent from './UpdatePasswordComponent';
import CredentialsComponent from './CredentialsComponent';
import FileUploadComponent from './FileUploadComponent';
import { ModalContext } from '../context/ModalContext';

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState<string>('');
  const [isFileAttached, setIsFileAttached] = useState<boolean>(false); // Track if file is attached

  const {
    file,
    setFile,
    userPass,
    currentPassword,
    newPassword,
    password,
    privateKey,
  } = useContext(ModalContext);
  const {
    history,
    addMessage,
    generateChat,
    showPasswordModal,
    setShowPasswordModal,
    showCredentialsModal,
    setShowCredentialsModal,
    showUpdatePasswordModal,
    setShowUpdatePasswordModal,
    showFileUploadModal,
    setShowFileUploadModal,
  } = useChatStore();
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

  useEffect(() => {
    if (password) {
      generateChat(
        message.trim(),
        file,
        userPass,
        currentPassword,
        newPassword,
        password,
        privateKey
      );
    }
  }, [showCredentialsModal]);

  useEffect(() => {
    if (currentPassword) {
      generateChat(
        message.trim(),
        file,
        userPass,
        currentPassword,
        newPassword,
        password,
        privateKey
      );
    }
  }, [showUpdatePasswordModal]);

  useEffect(() => {
    if (file) {
      generateChat(
        message.trim(),
        file,
        userPass,
        currentPassword,
        newPassword,
        password,
        privateKey
      );
    }
  }, [showFileUploadModal]);

  useEffect(() => {
    if (password) {
      generateChat(
        message.trim(),
        file,
        userPass,
        currentPassword,
        newPassword,
        password,
        privateKey
      );
    }
  }, [showPasswordModal]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage: ChatMessage = {
      id: history.length + 1,
      sender: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    addMessage(newMessage);
    generateChat(
      message.trim(),
      file,
      userPass,
      currentPassword,
      newPassword,
      password,
      privateKey
    );
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

  useEffect(() => {
    const chatHistoryElement = document.getElementById('chat-history');
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
  }, [history]);

  const hidePasswordInput = () => {
    setShowPasswordModal(false);
  };

 {/* Credentials Logic */}
  const addCredentialsMessage = () => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: (
        <CredentialsComponent
        />
      ),
      timestamp: Date.now(),
    };
    addMessage(newMessage);
  };

  useEffect(() => {
    if (showCredentialsModal) {
      addCredentialsMessage();
    }
  }, [showCredentialsModal]);

  {/* Update Password Logic */}
  const addUpdatePasswordMessage = () => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: (
        <UpdatePasswordComponent
        />
      ),
      timestamp: Date.now(),
    };
    addMessage(newMessage);
  };

  useEffect(() => {
    if (showUpdatePasswordModal) {
      addUpdatePasswordMessage();
    }
  }, [showUpdatePasswordModal]);

  {/* Send Email Logic */}
  const addPasswordMessage = () => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: (
        <PasswordComponent
        />
      ),
      timestamp: Date.now(),
    };
    addMessage(newMessage);
  };

  useEffect(() => {
    if (showPasswordModal) {
      addPasswordMessage();
    }
  }, [showPasswordModal]);

  {/* File Upload Modal */}
const addTelegramMessage = () => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content: (
        <FileUploadComponent
        onFileSelect={(file) => {
          setFileName(file.name);
          setIsFileAttached(true);
        }}
        />
      ),
      timestamp: Date.now(),
    };
    addMessage(newMessage);
  };

  useEffect(() => {
    if (showFileUploadModal) {
      addTelegramMessage();
    }
  }, [showFileUploadModal]);

  return (
    <>
      {/* <Modal isOpen={showPasswordModal} onClose={hidePasswordInput}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PasswordComponent />
          </ModalBody>
        </ModalContent>
      </Modal> */}

      {/* Update Password Modal */}
      {/* <Modal
        isOpen={showUpdatePasswordModal}
        onClose={() => setShowUpdatePasswordModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdatePasswordComponent />
          </ModalBody>
        </ModalContent>
      </Modal> */}

      {/* Credentials Modal */}
      {/* <Modal
        isOpen={showCredentialsModal}
        onClose={() => setShowCredentialsModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Credentials</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CredentialsComponent />
          </ModalBody>
        </ModalContent>
      </Modal> */}

      {/* File Upload Modal */}
      {/* <Modal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FileUploadComponent
              onFileSelect={(file) => {
                setFileName(file.name);
                setIsFileAttached(true);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal> */}

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
      <HStack mt={2}>{isFileAttached && <span>{fileName}</span>}</HStack>
      <HStack mt={2}>
        <RunChatButton sendMessage={handleSendMessage} />
        <Spacer />
        {debugMode && <TaskStatus />}
      </HStack>
    </>
  );
};

export default ChatUI;
