import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";

export default function HistoricoPrivacidade({ userId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setShowPrivacySettings } = useModal();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/privacidade/${userId}`
        );
        setLogs(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico de privacidade:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchLogs();
  }, [userId]);

  const friendlyLabels = {
    optInNews: "Receber novidades por e-mail",
    optInShare: "Compartilhamento de dados com parceiros",
    optInTerms: "Aceite dos Termos de Uso",
    essential: "Cookies essenciais",
    preferences: "Cookies de preferências",
    analytics: "Cookies de análise",
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Histórico de Atividades de Privacidade
      </h1>

      <div className="mb-6 text-sm text-gray-600 text-center">
        <p>
          Veja aqui os consentimentos e ações que você registrou em nosso
          sistema, conforme previsto na LGPD.
        </p>
        <p className="mt-1">
          <span
            onClick={() => setShowPrivacySettings(true)}
            className="text-gray-600 underline cursor-pointer"
          >
            Gerenciar minhas configurações de privacidade
          </span>
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando histórico...</p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma atividade registrada até o momento.
        </p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log, index) => (
            <li
              key={index}
              className="bg-white border border-gray-200 shadow-sm rounded p-4 text-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">
                  {log.acao.replaceAll("_", " ")}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(log.data).toLocaleString("pt-BR")}
                </p>
              </div>

              {log.detalhes && (
                <div className="mt-3 space-y-1">
                  {Object.entries(log.detalhes).map(([key, value]) => {
                    
                    if (key === "cookies" && typeof value === "object") {
                      return (
                        <div key="cookies">
                          <p className="font-semibold text-gray-700 mt-2">
                            Cookies:
                          </p>
                          <ul className="ml-4 list-disc text-gray-700">
                            {Object.entries(value).map(
                              ([cookieKey, cookieValue]) => (
                                <li
                                  key={cookieKey}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-medium">
                                    {friendlyLabels[cookieKey] || cookieKey}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      cookieValue
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {cookieValue ? " Ativado" : " Desativado"}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {friendlyLabels[key] || key}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            value
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {value ? " Sim" : " Não"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
