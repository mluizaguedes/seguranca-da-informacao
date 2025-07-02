import React, { useEffect, useState } from "react";
import "./index.css";
import api from "../../services/api";

export default function PoliticaDePrivacidade() {
  const [privacidade, setPrivacidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  api.get("/politicas/privacidade")
    .then((res) => {
      setPrivacidade(res.data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Carregando politica de privacidade...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="container">
      <h1> {privacidade.titulo || "Política de Privacidade"}</h1>
      <div dangerouslySetInnerHTML={{ __html: privacidade.conteudo }} />
    </div>
  );
}