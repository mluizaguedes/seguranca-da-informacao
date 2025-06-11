import React, { useState, useEffect } from "react";
import './index.css';

export default function ConfigPrivacidade({ onSave, onClose }) {
  const [settings, setSettings] = useState({
    preferences: false,
    analytics: false,
    novidadesEmail: false,
    compartilharParceiros: false
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cookieConsent"));
    if (saved) {
      setSettings((prev) => ({
        ...prev,
        preferences: saved.preferences || false,
        analytics: saved.analytics || false,
        novidadesEmail: saved.novidadesEmail || false,
        compartilharParceiros: saved.compartilharParceiros || false
      }));
    }
  }, []);

  const handleCheckboxChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    const consent = {
      essential: true,
      ...settings
    };

    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    onSave(consent);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-black"
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Configurações de Privacidade</h2>
        <p className="mb-6 text-sm">
          Em conformidade com a LGPD, você pode revisar e alterar suas
          preferências de privacidade a qualquer momento. Saiba mais na nossa{" "}
          <a
            href="/politica-de-cookies"
            className="underline text-blue-300 ml-1"
          >
            Política de Cookies
          </a>{" "}
          e{" "}
          <a
            href="/politica-de-privacidade"
            className="underline text-blue-300 ml-1"
          >
            Política de Privacidade
          </a>.
        </p>

        <h3 className="mb-2 font-semibold">Configurações de Cookies</h3>
        <div className="space-y-4 mb-6">
          <label className="block">
            <input
              type="checkbox"
              checked={settings.preferences}
              onChange={() => handleCheckboxChange("preferences")}
              className="mr-2"
            />
            <span className="font-semibold">Funcionalidades (preferências)</span>
            <p className="text-sm text-gray-600">
              Lembra suas escolhas como idioma ou tema do site.
            </p>
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={() => handleCheckboxChange("analytics")}
              className="mr-2"
            />
            <span className="font-semibold">Análise de uso</span>
            <p className="text-sm text-gray-600">
              Ajuda a melhorar nosso site com base em como você o utiliza.
            </p>
          </label>
        </div>

        <h3 className="mb-2 font-semibold">Consentimentos adicionais</h3>
        <div className="space-y-4">
          <label className="block">
            <input
              type="checkbox"
              checked={settings.novidadesEmail}
              onChange={() => handleCheckboxChange("novidadesEmail")}
              className="mr-2"
            />
            <span className="font-semibold">Receber novidades por e-mail</span>
            <p className="text-sm text-gray-600">
              Enviar comunicações com atualizações, novidades e avisos.
            </p>
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={settings.compartilharParceiros}
              onChange={() => handleCheckboxChange("compartilharParceiros")}
              className="mr-2"
            />
            <span className="font-semibold">Compartilhar com parceiros educacionais</span>
            <p className="text-sm text-gray-600">
              Autoriza o uso dos dados para fins de parcerias acadêmicas (sem venda de dados).
            </p>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm"
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
}