import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacyUserId, setPrivacyUserId] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        showPrivacySettings,
        setShowPrivacySettings,
        privacyUserId,
        setPrivacyUserId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
