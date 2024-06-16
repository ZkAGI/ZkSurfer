import { Button, Input, VStack, Text, Link, HStack } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { updateSettings } = useAppState((state) => ({
    updateSettings: state.settings.actions.update,
  }));

  const [zynapseKey, setzynapseKey] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <VStack spacing={4}>
      <Text fontSize="sm">
        You'll need an Zynapse Key to run the ZkSurf in developer mode. If you
        don't already have one available, you can create one in your{' '}
        <Link
          href=""
          color="blue"
          isExternal
        >
          zynapse account
        </Link>
        .
        <br />
        <br />
        ZkSurf stores your API key locally and securely, and it is only used to
        communicate with the zynapse API.
      </Text>
      <HStack w="full">
        <Input
          placeholder="zynapse API Key"
          value={zynapseKey}
          onChange={(event) => setzynapseKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <Button
        onClick={() => updateSettings({ zynapseKey })}
        w="full"
        disabled={!zynapseKey}
        colorScheme="blue"
      >
        Save Key
      </Button>
    </VStack>
  );
};

export default ModelDropdown;
