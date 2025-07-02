import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function HistoricoTermosAdmin({ adminId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminLogs() {
      try {
        const token = localStorage.getItem("token"); // ⚠️ importante
        const res = await api.get(
          `/historico-logs?userId=${adminId}&acao=TERMO_VERSAO_CRIADA`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs(res.data);
      } catch (err) {
        console.error("Erro ao buscar histórico do admin:", err);
      } finally {
        setLoading(false);
      }
    }

    if (adminId) fetchAdminLogs();
  }, [adminId]);

  if (loading) return <p>Carregando histórico de alterações...</p>;
  if (logs.length === 0) return <p>Nenhuma alteração de termos registrada.</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-md">
        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
          <tr>
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Versão</th>
            <th className="px-4 py-2 text-left">Termos</th>
            <th className="px-4 py-2 text-left">Criado por</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {logs.map((log) => {
            const termosAgrupados = log.detalhes?.termos || {};
            const todosTermos = Object.entries(termosAgrupados).flatMap(
              ([tipo, termos]) =>
                termos.map((termo) => ({
                  ...termo,
                  tipo,
                }))
            );

            return (
              <tr key={log._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{log.detalhes?.versao || "-"}</td>
                <td className="px-4 py-2 break-words max-w-md">
                  <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
                    {todosTermos.map((termo, index) => (
                      <li key={index}>
                        <span className="font-medium capitalize">
                          [{termo.tipo}] {termo.titulo}
                        </span>
                        <br />
                        <span className="text-gray-600">{termo.descricao}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">
                  {log.userId?.nome || log.userId?.email || "Desconhecido"}
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
