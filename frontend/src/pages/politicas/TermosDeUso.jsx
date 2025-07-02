import React, { useEffect, useState } from "react";
import "./index.css";
import api from "../../services/api";

export default function TermosDeUso() {
  const [termos, setTermos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  api.get("/politicas/uso")
    .then((res) => {
      setTermos(res.data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Carregando termos de uso...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="container">
      <h1>{termos.titulo || "Termos de Uso"}</h1>
      <div dangerouslySetInnerHTML={{ __html: termos.conteudo }} />
    </div>
  );
}
