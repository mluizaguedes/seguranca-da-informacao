import React, { useState, useEffect } from "react";
import ConfigCookies from "./ConfigCookies";
import { Link } from "react-router-dom";

export default function CookieBanner({ user, onConsent, onOpenSettings }) {
  const [visible, setVisible] = useState(false);
  
  // No componente após o login bem-sucedido:
  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem("cookieConsent"));
    if (user && consent && !consent.sentToServer) {
      axios.post("/api/consentimento", {
        userId: user.id, 
        consentimento: consent,
        data: new Date().toISOString()
      }).then(() => {

        consent.sentToServer = true;
        localStorage.setItem("cookieConsent", JSON.stringify(consent));
      }).catch(err => {
        console.error("Erro ao salvar consentimento:", err);
      });
    }
  }, [user]);

  const acceptAll = () => {
    const consent = {
      essential: true,
      preferences: true,
      analytics: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setVisible(false);
    onConsent(consent);
  };

  const rejectCookies = () => {
    const consent = {
      essential: true, 
      preferences: false,
      analytics: false
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    setVisible(false);
    onConsent(consent);
  };

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;
  
  console.log("cookieConsent no CookieBanner:", localStorage.getItem("cookieConsent"));
  console.log("Banner está visível?", visible);

  return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-6 z-40 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
          <b>Configurações de Privacidade </b>
          <p className="flex-1">
            Para lhe fornecer a melhor experiência possível, usamos cookies e
            tecnologias similares. Alguns cookies são necessários para que o
            nosso site funcione e não podem ser rejeitados. Você pode aceitar ou
            rejeitar o uso de cookies adicionais, que utilizamos apenas para
            melhorar a sua experiência. Nenhuma dessas informações é vendida ou
            utilizada para fazer propaganda. Para saber mais, leia a{" "}
            <Link to="/politica-de-cookies" className="underline text-blue-300 ml-1">
              Política sobre uso de cookies e tecnologias similares
            </Link>
            . Você pode personalizar suas configurações a qualquer momento
            acessando a página{" "}
            <span
              onClick={onOpenSettings}
              className="text-blue-400 underline ml-1 cursor-pointer hover:text-blue-300"
            >
              Configurações de privacidade
            </span>
            .
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={acceptAll}
              className="bg-teal-700 px-4 py-2 rounded hover:bg-teal-600 text-white text-sm"
            >
              Aceitar Todos
            </button>
            <button
              onClick={rejectCookies}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 text-white text-sm"
            >
              Rejeitar
            </button>
            <button
              onClick={onOpenSettings}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 text-white text-sm"
            >
              Personalizar
            </button>
          </div>
        </div>
      </div>
  );
}
