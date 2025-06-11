import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditarTermos() {
  const [termo, setTermo] = useState({ titulo: "", conteudo: "", _id: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Acesso negado");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    axios.get("/api/termos").then((res) => {
      if (res.data) setTermo(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setTermo({ ...termo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (termo._id) {
      await axios.put(`/api/termos/${termo._id}`, termo);
    } else {
      await axios.post("/api/termos", termo);
    }
    alert("Termo salvo!");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Editar Termos de Uso</h1>

      <input
        className="w-full border px-3 py-2 mb-2"
        name="titulo"
        placeholder="Título"
        value={termo.titulo}
        onChange={handleChange}
      />
      <textarea
        className="w-full border px-3 py-2 mb-4 h-60"
        name="conteudo"
        placeholder="Conteúdo dos termos..."
        value={termo.conteudo}
        onChange={handleChange}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Salvar
      </button>
    </div>
  );
}
