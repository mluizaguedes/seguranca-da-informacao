import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./index.css";

export default function BannerTermosAtualizados({ userId, onAceitar, onFechar }) {
  const [versao, setVersao] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const token = localStorage.getItem("token");
  console.log("user banner", userId)
  useEffect(() => {
    async function fetchTermos() {
      try {
        const res = await api.get("/termos/versao-atual");
        setVersao(res.data);

        const respostasIniciais = {};
        res.data.termos.obrigatorio.forEach((t) => (respostasIniciais[t.id] = true));
        res.data.termos.optin.forEach((t) => (respostasIniciais[t.id] = false));
        res.data.termos.optout.forEach((t) => (respostasIniciais[t.id] = false));
        setRespostas(respostasIniciais);
      } catch (error) {
        console.error("Erro ao buscar termos:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchTermos();
  }, []);

  const handleToggle = (id) => {
    setRespostas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAceitar = async () => {
    try {
      await api.put(`/consentimento/${userId}`, {
        versao: versao.versao,
        respostas,
        data: new Date(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (onFechar) onFechar();
      if (onAceitar) onAceitar();
    } catch (err) {
      console.error("Erro ao salvar consentimento:", err);
      alert("Erro ao registrar consentimento. Tente novamente.");
    }
  };

  if (carregando || !versao) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Nova versão dos termos ({versao.versao})
        </h2>

        {/* Obrigatórios */}
        {versao.termos.obrigatorio.length > 0 && (
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Termos obrigatórios</h3>
            {versao.termos.obrigatorio.map((termo) => (
              <div key={termo.id} className="mb-4">
                <h4 className="font-medium">{termo.titulo}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{termo.descricao}</p>
              </div>
            ))}
          </div>
        )}

        {versao.termos.optin.length > 0 && (
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Termos opcionais</h3>
            {versao.termos.optin.map((termo) => (
              <div key={termo.id} className="mb-4">
                <h4 className="font-medium">{termo.titulo}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{termo.descricao}</p>
                <label className="flex items-center mt-1 gap-2">
                  <input
                    type="checkbox"
                    checked={respostas[termo.id]}
                    onChange={() => handleToggle(termo.id)}
                  />
                  Concordo com este termo
                </label>
              </div>
            ))}
          </div>
        )}

        {versao.termos.optout.length > 0 && (
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Termos opcionais</h3>
            {versao.termos.optout.map((termo) => (
              <div key={termo.id} className="mb-4">
                <h4 className="font-medium">{termo.titulo}</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{termo.descricao}</p>
                <label className="flex items-center mt-1 gap-2">
                  <input
                    type="checkbox"
                    checked={respostas[termo.id]}
                    onChange={() => handleToggle(termo.id)}
                  />
                  Concordo com este termo
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={handleAceitar}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Aceitar termos atualizados
          </button>
        </div>
      </div>
    </div>
  );
}
