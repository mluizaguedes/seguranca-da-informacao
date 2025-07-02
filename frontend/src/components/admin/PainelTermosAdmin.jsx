import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function PainelTermosAdmin() {
  const [versoes, setVersoes] = useState([]);
  const [versaoNova, setVersaoNova] = useState("");
  const [termos, setTermos] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchVersoes();
  }, []);

  const fetchVersoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/termos/versoes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVersoes(res.data);
    } catch (e) {
      console.error("Erro ao carregar versões:", e);
      setError("Falha ao carregar versões.");
    }
  };

  const handleAddTermo = (tipo) => {
    setTermos((t) => [
      ...t,
      {
        id: Date.now().toString(),
        titulo: "",
        descricao: "",
        tipo,
      },
    ]);
  };

  const handleTermoChange = (index, campo, valor) => {
    const novos = [...termos];
    novos[index][campo] = valor;
    setTermos(novos);
  };

  const handleRemoveTermo = (index) => {
    setTermos((t) => t.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!versaoNova.trim()) {
      setError("Informe a versão.");
      return;
    }

    if (termos.length === 0) {
      setError("Adicione pelo menos um termo.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/termos",
        { versao: versaoNova.trim(), termos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Nova versão criada com sucesso!");
      setVersaoNova("");
      setTermos([]);
      fetchVersoes();
    } catch (err) {
      console.error("Erro ao criar nova versão:", err);
      setError(err.response?.data?.error || "Erro desconhecido.");
    }
  };

  const tipos = ["obrigatorio", "optIn"];
  const nomesTipos = {
    obrigatorio: "Termo obrigatório (necessário)",
    optIn: "Termo opcional",
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Nova Versão de Termos</h3>
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="Ex: 1.4.0"
          value={versaoNova}
          onChange={(e) => setVersaoNova(e.target.value)}
        />

        {tipos.map((tipo) => (
          <div key={tipo} className="border p-4 rounded bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-700">{nomesTipos[tipo]}</h4>
              <button
                onClick={() => handleAddTermo(tipo)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Adicionar termo
              </button>
            </div>
            {termos
              .filter((t) => t.tipo === tipo)
              .map((termo) => (
                <div key={termo.id} className="mb-4 border p-3 rounded bg-white">
                  <input
                    className="block w-full mb-2 border-b p-1"
                    placeholder="Título"
                    value={termo.titulo}
                    onChange={(e) =>
                      handleTermoChange(
                        termos.findIndex((t) => t.id === termo.id),
                        "titulo",
                        e.target.value
                      )
                    }
                  />
                  <textarea
                    className="block w-full border p-2 rounded text-sm"
                    rows={2}
                    placeholder="Descrição do termo"
                    value={termo.descricao}
                    onChange={(e) =>
                      handleTermoChange(
                        termos.findIndex((t) => t.id === termo.id),
                        "descricao",
                        e.target.value
                      )
                    }
                  />
                  <button
                    onClick={() =>
                      handleRemoveTermo(termos.findIndex((t) => t.id === termo.id))
                    }
                    className="text-red-500 text-xs mt-2 hover:underline"
                  >
                    Remover termo
                  </button>
                </div>
              ))}
          </div>
        ))}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow mt-4"
        >
          Salvar nova versão
        </button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Versões Cadastradas</h3>
        {versoes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma versão encontrada.</p>
        ) : (
          <ul className="text-sm list-disc pl-5 space-y-1">
            {versoes.map((v) => (
              <li key={v._id}>
                <span className="font-medium">{v.versao}</span> -{" "}
                {new Date(v.publicadoEm || v.createdAt).toLocaleString()} -{" "}
                {v.termos.length} termos
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
