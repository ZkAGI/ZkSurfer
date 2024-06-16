import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { selectedModel, updateSettings } = useAppState((state) => ({
    selectedModel: state.settings.selectedModel,
    updateSettings: state.settings.actions.update,
  }));

  const { zynapseKey } = useAppState((state) => ({
    zynapseKey: state.settings.zynapseKey,
  }));

  if (!zynapseKey) return null;

  return (
    // Chakra UI Select component
    <Select
      value={selectedModel || ''}
      onChange={(e) => updateSettings({ selectedModel: e.target.value })}
    >
      <option value='Mistral'>zkml</option>
    </Select>
  );
};

export default ModelDropdown;
