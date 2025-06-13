import React, { useEffect, useState } from "react";
import HistoricoPrivacidade from "../historico/Historico";
import { useModal } from "../../contexts/ModalContext";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const { setShowPrivacySettings, setPrivacyModalUserId } = useModal();

  useEffect(() => {
    const alunoJson = localStorage.getItem("aluno");
    if (alunoJson) {
      const aluno = JSON.parse(alunoJson);
      const id = aluno.id || aluno._id;
      setUserId(id);
      setPrivacyModalUserId(id);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuário LOGADO!</h1>

      {userId ? (
        <HistoricoPrivacidade userId={userId} />
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </div>
  );
}