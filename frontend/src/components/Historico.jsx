import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Historico({ userId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/privacidade/${userId}`);
        setLogs(res.data);
      } catch (err) {
        console.error("Erro ao carregar histórico de privacidade:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [userId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-black"
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Histórico de Privacidade</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Carregando histórico...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma atividade registrada.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {logs.map((log, idx) => (
              <li key={idx} className="bg-gray-50 border p-3 rounded shadow">
                <strong>Ação:</strong> {log.acao.replaceAll('_', ' ')} <br />
                <strong>Data:</strong>{" "}
                {new Date(log.data).toLocaleString("pt-BR")} <br />
                <strong>Detalhes:</strong>{" "}
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(log.detalhes, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}