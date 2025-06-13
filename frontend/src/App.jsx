import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import { useModal } from './contexts/ModalContext';
import LogTable from "./components/LogTable";
import CookieBanner from "./components/config.privacidade/CookieBanner";
import ConfigPrivacidade from "./components/config.privacidade/ConfigPrivacidade";
import ConfigCookies from "./components/config.privacidade/ConfigCookies";
import PoliticaDeCookies from "./pages/politicas/Cookies";
import Termos from "./pages/politicas/Termos";
import PoliticaDePrivacidade from "./pages/politicas/Privacidade";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import Home from "./pages/home";
import HistoricoPrivacidade from "./pages/historico/Historico";

import Footer from "./components/layout/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [cookieConsent, setCookieConsent] = useState({
    essential: false,
    preferences: false,
    analytics: false,
  });
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  console.log("cookieConsent no App:", cookieConsent);

  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const { showPrivacySettings, setShowPrivacySettings, privacyModalUserId } = useModal();

  useEffect(() => {
    const saved = localStorage.getItem("cookieConsent");
    if (saved) {
      setCookieConsent(JSON.parse(saved));
      setShowCookieBanner(false);
    } else {
      setShowCookieBanner(true);
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleConsentUpdate = (newConsent) => {
    setCookieConsent(newConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(newConsent));
    setShowCookieBanner(false);
  };

  return (
    <Router>
      {/* modal configurações de cookies */}
      {showCookieSettings && (
        <ConfigCookies
          onSave={(settings) => {
            handleConsentUpdate(settings);
            setShowCookieSettings(false);
          }}
          onClose={() => setShowCookieSettings(false)}
        />
      )}

      {/* modal configurações de privacidade */}
      {showPrivacySettings && privacyModalUserId && (
        <ConfigPrivacidade
          userId={privacyModalUserId}
          onSave={(settings) => {
            handleConsentUpdate(settings);
            setShowPrivacySettings(false);
          }}
          onClose={() => setShowPrivacySettings(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<Cadastro cookieConsent={cookieConsent} />} />
        <Route path="/login" element={<Login />} />

        <Route path="/log-table" element={<LogTable />} />

        <Route path="/termos-de-uso" element={<Termos />} />
        <Route
          path="/politica-de-privacidade"
          element={<PoliticaDePrivacidade />}
        />
        <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />

        <Route
          path="/historico-privacidade"
          element={<HistoricoPrivacidade userId={user?.id} />}
        />
        <Route path="/home" element={<Home />} />

        {/*<Route path="/admin/termos" element={<EditarTermos />} />*/}
      </Routes>

      {/* banner de cookies */}
      {showCookieBanner && (
        <CookieBanner
          user={user}
          onConsent={handleConsentUpdate}
          onOpenSettings={() => setShowCookieSettings(true)}
        />
      )}

      <Footer onOpenPrivacySettings={() => setShowPrivacySettings(true)} />
    </Router>
  );
}

export default App;
