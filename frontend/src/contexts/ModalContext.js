import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacyModalUserId, setPrivacyModalUserId] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        showPrivacySettings,
        setShowPrivacySettings,
        privacyModalUserId,
        setPrivacyModalUserId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);