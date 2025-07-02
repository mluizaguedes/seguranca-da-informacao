import React, { useState, useEffect } from "react";
import "./index.css";
import api from "../../services/api";

export default function ConfigPrivacidade({ userId, onSave, onClose }) {
  const [termos, setTermos] = useState({ obrigatorio: [], optin: [], optout: [] });
  const [respostas, setRespostas] = useState({});
  const [respostasOriginais, setRespostasOriginais] = useState({});
  const [versao, setVersao] = useState(null);

  useEffect(() => {
    if (!userId) return;

    async function carregarTermosEConsentimento() {
      try {
        const [termosRes, consentRes] = await Promise.all([
          api.get("/termos/versao-atual"),
          api.get(`/consentimento/${userId}`)
        ]);

        const termosData = termosRes.data;
        const versaoAtual = termosData.versao;
        setVersao(versaoAtual);
        setTermos(termosData.termos);

        const respostasSalvas = consentRes.data?.respostas || {};
        setRespostas(respostasSalvas);
        setRespostasOriginais(respostasSalvas);
      } catch (err) {
        console.error("Erro ao buscar termos ou consentimento:", err);
      }
    }

    carregarTermosEConsentimento();
  }, [userId]);

  const handleToggle = (id) => {
    setRespostas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isEqual = (a, b) => {
    const chaves = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (let chave of chaves) {
      if (a[chave] !== b[chave]) return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!userId || !versao) return;

    if (isEqual(respostas, respostasOriginais)) {
      alert("Nenhuma alteração foi feita nas preferências.");
      onClose();
      return;
    }

    try {
      await api.post(
        "/consentimento",
        {
          versao,
          respostas,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Preferências salvas com sucesso!");
      setRespostasOriginais(respostas);
      onSave && onSave(respostas);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar consentimento:", err);
      alert("Erro ao salvar preferências.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl">×</button>
        <h2 className="text-xl font-bold mb-4">Configurações de Privacidade</h2>

        {["obrigatorio", "optin", "optout"].map((tipo) => (
          <div key={tipo} className="mb-4">
            {termos[tipo]?.map((termo) => (
              <label key={termo.id} className="block cursor-pointer mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={respostas[termo.id] || false}
                  disabled={tipo === "obrigatorio"}
                  onChange={() => handleToggle(termo.id)}
                />
                <span className="font-semibold">{termo.titulo}</span>{" "}
                <span className="text-xs text-gray-600">({tipo})</span>
                <p className="text-sm text-gray-600">{termo.descricao}</p>
              </label>
            ))}
          </div>
        ))}

        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
          >
            Revogar todos os consentimentos
          </button>

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