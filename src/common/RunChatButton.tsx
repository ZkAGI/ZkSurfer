import React from 'react';
import { Button, HStack, Icon } from '@chakra-ui/react';
import { BsPlayFill } from 'react-icons/bs';

const RunChatButton = ({ sendMessage }: { sendMessage: () => void }) => {
  return (
    <HStack alignItems="center">
      <Button
        rightIcon={<Icon as={BsPlayFill} boxSize={6} />}
        onClick={sendMessage} // Call the sendMessage function when the button is clicked
        colorScheme="green"
      >
        Send Message
      </Button>
    </HStack>
  );
};

export default RunChatButton;
