import React, { useState, useCallback, useEffect } from 'react';
import { VStack, HStack, Textarea, useToast, Spacer, Button } from '@chakra-ui/react';
import useChatStore, { ChatMessage } from '../state/chat';
import RunChatButton from './RunChatButton';
import ChatHistory from './ChatHistory';
import { debugMode } from '../constants';
import TaskStatus from './TaskStatus';

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { history, addMessage, generateChat } = useChatStore();
  const toast = useToast();

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
    generateChat(message.trim(), file);
    setMessage('');
    setFile(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const chatHistoryElement = document.getElementById('chat-history');
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
  }, [history]);

  return (
    <>
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
      <label htmlFor="file-upload">
        <Button as="span" colorScheme="blue">
          Attach File
        </Button>
      </label>
      <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <HStack mt={2}>
        <RunChatButton sendMessage={handleSendMessage} />
        <Spacer />
        {debugMode && <TaskStatus />}
      </HStack>
    </>
  );
};

export default ChatUI;
