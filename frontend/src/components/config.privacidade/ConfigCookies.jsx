import React, { useState, useEffect } from "react";
import './index.css';

export default function ConfigCookies({ onSave, onClose }) {
  const [settings, setSettings] = useState({
    preferences: false,
    analytics: false
  });

  // Carrega consentimento anterior, se houver
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cookieConsent"));
    if (saved) {
      setSettings({
        preferences: saved.preferences || false,
        analytics: saved.analytics || false
      });
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

        <h2 className="text-xl font-bold mb-4">Configurações de privacidade</h2>
        <p className="mb-6 text-sm">
          Utilizamos cookies e tecnologias semelhantes para oferecer uma melhor
          experiência. Alguns cookies são essenciais para o funcionamento do
          site, enquanto outros nos ajudam a entender como você o utiliza.
          Nenhum dado é vendido ou utilizado para fins de publicidade. Saiba
          mais na nossa{" "}
          <a
            href="/politica-de-cookies"
            className="underline text-blue-300 ml-1"
          >
            Política sobre uso de cookies
          </a>
          .
        </p>

        <h3 className="mb-2 font-semibold">Alterar configurações</h3>

        <div className="space-y-4">
          <label className="block">
            <input
              type="checkbox"
              checked={settings.preferences}
              onChange={() => handleCheckboxChange("preferences")}
              className="mr-2"
            />
            <span className="font-semibold">Permitir cookies de funcionalidades</span>
            <p className="text-sm text-gray-600">
              Salvar preferências como idioma, aparência, e outras opções para melhorar sua experiência.
            </p>
          </label>

          <label className="block">
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={() => handleCheckboxChange("analytics")}
              className="mr-2"
            />
            <span className="font-semibold">Permitir cookies de análise</span>
            <p className="text-sm text-gray-600">
              Coletar informações sobre como você usa o site para melhorar o design, desempenho e estabilidade.
            </p>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}