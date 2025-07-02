import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import { useModal } from './contexts/ModalContext';
import { PrivateRoute } from './routes/PrivateRoute';

import Cadastro from './pages/cadastro';
import Login from './pages/login';
import LogTable from './components/LogTable';
import Footer from './components/layout/Footer';
import ConfigPrivacidade from './components/config.privacidade/ConfigPrivacidade';

import Perfil from './pages/perfil';
import PerfilAdmin from './pages/admin/PerfilAdmin';

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { showPrivacySettings, setShowPrivacySettings, privacyUserId } = useModal();

  useEffect(() => {
  if (!storedUser) {
    console.warn("Nenhum userId fornecido para ConfigPrivacidade");
    return;
  }

}, [storedUser]);

  return (
    <Router>
      {/* Modal de configurações */}

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
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/perfil-admin" element={<PrivateRoute><PerfilAdmin /></PrivateRoute>} />
        <Route path="/log-table" element={<LogTable />} />
      </Routes>

      <Footer />

    </Router>
  );
}

export default App;