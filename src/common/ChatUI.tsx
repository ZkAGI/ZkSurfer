import React, { useState, useCallback, useEffect } from 'react';
import { VStack, HStack, Textarea, useToast, Spacer } from '@chakra-ui/react';
import useChatStore, { ChatMessage } from '../state/chat';
import RunChatButton from './RunChatButton'; // Import RunChatButton
import ChatHistory from './ChatHistory'; // Assuming you have a component named ChatHistory
import { debugMode } from '../constants';
import TaskStatus from './TaskStatus';

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const { history, addMessage, generateChat } = useChatStore(); // Destructure generateChat from useChatStore
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
    generateChat(message.trim()); // Call generateChat with the user message
    setMessage('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Use useEffect to auto-scroll to the bottom of the chat history when a new message is added
  useEffect(() => {
    const chatHistoryElement = document.getElementById('chat-history');
    if (chatHistoryElement) {
      chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    }
  }, [history]);

  return (
    <>
      <ChatHistory messages={history} /> {/* Pass history as messages to ChatHistory */}
      <Textarea
        autoFocus
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={false}
        mb={2}
        onKeyDown={onKeyDown}
      />
      <HStack>
        <RunChatButton sendMessage={handleSendMessage} />
        <Spacer />
        {debugMode && <TaskStatus />}
      </HStack>
    </>
  );
};

export default ChatUI;
