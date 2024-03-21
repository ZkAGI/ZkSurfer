import { VStack, Box, Text, Spacer, Button } from '@chakra-ui/react';
import React from 'react';
import useChatStore, { ChatMessage } from '../state/chat'; // Adjust import path as needed

const ChatHistoryItem = ({ message }: { message: ChatMessage }) => {
  const isUserMessage = message.sender === 'user';

  return (
    <Box
      p={2}
      borderRadius={8}
      bg={isUserMessage ? 'blue.100' : 'gray.100'}
      alignSelf={isUserMessage ? 'flex-end' : 'flex-start'}
      maxW="70%"
    >
      <Text color={isUserMessage ? 'blue.900' : 'gray.900'}>{message.content}</Text>
    </Box>
  );
};

const ChatHistory = ({ messages }: { messages: ChatMessage[] }) => { // Accept messages as a prop
  if (messages.length === 0) return null;

  return (
    <VStack id="chat-history" mt={8} align="flex-start" spacing={4}>
      {messages.map((message, index) => (
        <ChatHistoryItem key={index} message={message} />
      ))}
      <Spacer />
      <Button colorScheme="blue" onClick={useChatStore.getState().clearHistory}>
        Clear History
      </Button>
    </VStack>
  );
};

export default ChatHistory;
