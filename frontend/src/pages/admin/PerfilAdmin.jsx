import React, { useEffect, useState } from "react";
import api from "../../services/api";
import HistoricoTermosAdmin from "../../components/admin/HistoricoTermosAdmin";
import PainelTermosAdmin from "../../components/admin/PainelTermosAdmin";

export default function PerfilAdmin() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/alunos/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data.user);
      } catch (error) {
        console.error("Erro ao carregar dados do admin:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Carregando...</p>;

  if (!admin)
    return (
      <p className="text-center mt-10 text-red-500">
        Não foi possível carregar dados do administrador.
      </p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <header className="flex items-center gap-5 mb-10 border-b pb-6">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-xl">
          {admin.nome.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{admin.nome}</h1>
          <p className="text-sm text-gray-600">{admin.email}</p>
        </div>
      </header>

      {/* Painel de gerenciamento de termos */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Painel de Termos e Versões
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <PainelTermosAdmin />
        </div>
      </section>

      {/* Histórico de alterações */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Histórico de Atualizações de Termos</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <HistoricoTermosAdmin adminId={admin._id || admin.id} />
        </div>
      </section>
    </div>
  );
}
