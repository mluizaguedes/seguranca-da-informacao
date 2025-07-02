import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import { useModal } from './contexts/ModalContext';
import { PrivateRoute } from './routes/PrivateRoute';

import Cadastro from './pages/cadastro';
import Login from './pages/login';
//import Home from './pages/home';
import LogTable from './components/LogTable';
import Footer from './components/layout/Footer';
//import CookieBanner from './components/config.privacidade/CookieBanner';
//import ConfigCookies from './components/config.privacidade/ConfigCookies';
import ConfigPrivacidade from './components/config.privacidade/ConfigPrivacidade';

//import PoliticaDeCookies from './pages/politicas/Cookies';
import PoliticaDePrivacidade from './pages/politicas/Privacidade';
import TermosDeUso from './pages/politicas/TermosDeUso';
import Perfil from './pages/perfil';

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { showPrivacySettings, setShowPrivacySettings, privacyUserId } = useModal();

  /*const [cookieConsent, setCookieConsent] = useState({
    essential: false,
    preferences: false,
    analytics: false,
  });
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false); */

  /*useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
      setShowCookieBanner(false);
    } else {
      setShowCookieBanner(true);
    }

    const savedUser = localStorage.getItem('aluno');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleConsentUpdate = (newConsent) => {
    setCookieConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setShowCookieBanner(false);
  };*/
  useEffect(() => {
  if (!storedUser) {
    console.warn("Nenhum userId fornecido para ConfigPrivacidade");
    return;
  }

}, [storedUser]);

  return (
    <Router>
      {/* Modais de configurações */}
      {/* {showCookieSettings && (
        <ConfigCookies
          onSave={(settings) => {
            handleConsentUpdate(settings);
            setShowCookieSettings(false);
          }}
          onClose={() => setShowCookieSettings(false)}
        />
      )}*/}

      {showPrivacySettings && (
        <ConfigPrivacidade
          userId={privacyUserId}
          onSave={(dados) => {
            console.log("Preferências salvas:", dados);
          }}
          onClose={() => setShowPrivacySettings(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<Cadastro /*cookieConsent={cookieConsent}*/ />} />
        <Route path="/login" element={<Login />} />
        {/*<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />*/}
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/log-table" element={<LogTable />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
        {/*<Route path="/politica-de-cookies" element={<PoliticaDeCookies />} /> */}
      </Routes>

      {/* Banners visuais */}
      {/*{showCookieBanner && (
        <CookieBanner
          user={user}
          onConsent={handleConsentUpdate}
          onOpenSettings={() => setShowCookieSettings(true)}
        />
      )}*/}

      {storedUser && <Footer userId={storedUser.id} />}

    </Router>
  );
}

export default App;