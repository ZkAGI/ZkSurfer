import React, { createContext, useState } from 'react';

interface ModalContextValue {
  file: File | null;
  setFile: (file: File | null) => void;
  userPass: string;
  setUserPass: (userPass: string) => void;
  currentPassword: string;
  setCurrentPassword: (currentPassword: string) => void;
  newPassword: string;
  setNewPassword: (newPassword: string) => void;
  password: string;
  setPassword: (password: string) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  file: null,
  setFile: () => {},
  userPass: '',
  setUserPass: () => {},
  currentPassword: '',
  setCurrentPassword: () => {},
  newPassword: '',
  setNewPassword: () => {},
  password: '',
  setPassword: () => {},
  privateKey: '',
  setPrivateKey: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [userPass, setUserPass] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const value: ModalContextValue = {
    file,
    setFile,
    userPass,
    setUserPass,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    password,
    setPassword,
    privateKey,
    setPrivateKey,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};