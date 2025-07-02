import React, { useEffect, useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import api from "../../services/api";

export default function HistoricoPrivacidade({ userId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setShowPrivacySettings, setPrivacyUserId } = useModal();

  useEffect(() => {
    let intervalId;

    const fetchLogs = async () => {
      if (!userId) return;

      try {
        const res = await api.get(`/privacidade/${userId}`);
        setLogs(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico de privacidade:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    intervalId = setInterval(fetchLogs, 5000);
    return () => clearInterval(intervalId);
  }, [userId]);

  function formatActionName(name) {
    return name
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

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
            onClick={() => {
              setPrivacyUserId(userId);
              setShowPrivacySettings(true);
            }}
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
          {logs.map((log) => (
            <li
              key={log._id || log.data}
              className="bg-white border border-gray-200 shadow-sm rounded p-4 text-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{formatActionName(log.acao)}</p>
                <p className="text-xs text-gray-500">{new Date(log.data).toLocaleString("pt-BR")}</p>
              </div>

              {/* Mostrar versão dos termos, se existir */}
              {log.detalhes?.versao && (
                <p className="mt-1 text-xs text-gray-600 font-medium">
                  Versão dos termos: <span className="font-normal">{log.detalhes.versao}</span>
                </p>
              )}

              {/* Resto do conteúdo */}
              {log.acao === "CONSENTIMENTO_REVOGADO" && log.detalhes?.revogadoEm && (
                <p className="mt-2 text-red-600 font-medium">
                  Consentimentos revogados em:{" "}
                  <span className="text-sm font-normal text-gray-800">
                    {new Date(log.detalhes.revogadoEm).toLocaleString("pt-BR")}
                  </span>
                </p>
              )}

              {log.detalhes && log.detalhes.termos && (
                <div className="mt-3 space-y-2">
                  {log.detalhes.termos.map((item) => {
                    const valor = log.detalhes?.respostas?.[item.id];
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{item.titulo}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            valor ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {valor ? "Sim" : "Não"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({["optIn", "optOut"].includes(item.tipo) ? "opcional" : "obrigatório"})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {log.origem && (
                <p className="mt-2 text-xs text-gray-400">Origem: {log.origem}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
