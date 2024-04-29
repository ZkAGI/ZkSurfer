import React, { useState } from 'react';
import { Input, Button, Box, Flex } from '@chakra-ui/react';
import { authenticateCode } from '../api/telegram_auth';
import useChatStore, { ChatMessage } from '../state/chat';

interface OTPProps {
  functionArguments: any;
}

const OTP: React.FC<OTPProps> = ({ functionArguments }) => {
  const [otp, setOTP] = useState('');
  const { addMessage } = useChatStore();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    if (otp.trim() !== '') {
      const res1 = await authenticateCode(functionArguments.phone, otp);
      const authMessage: ChatMessage = {
        id: Date.now(),
        sender: 'AI assistant',
        content: res1,
        timestamp: Date.now(),
      };
      addMessage(authMessage);
      setSubmitted(true)
    }
  };

  return (
    <Flex direction="column" align="center" w="full" maxW="md" mx="auto">
        {submitted ? (
        <div>OTP Submitted</div> 
      ) : (
        <Box  backgroundColor="gray.100"
        borderRadius="md"
        boxShadow="md"
        p={5}>
      <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOTPChange}
        mb={6}
      />
      <Button colorScheme="blue" onClick={handleSubmit} mb={4} isLoading={isLoading} loadingText="Sending otp..." width="full">
        Submit OTP
      </Button>
      </Box>
      )}
    </Flex>
  );
};

export default OTP;

