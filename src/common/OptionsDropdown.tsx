import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const OptionsDropdown = () => {
  const { zynapseKey, updateSettings } = useAppState((state) => ({
    zynapseKey: state.settings.zynapseKey,
    updateSettings: state.settings.actions.update,
  }));

  if (!zynapseKey) return null;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<SettingsIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          icon={<RepeatIcon />}
          onClick={() => {
            updateSettings({ zynapseKey: '' });
          }}
        >
          Reset API Key
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default OptionsDropdown;
