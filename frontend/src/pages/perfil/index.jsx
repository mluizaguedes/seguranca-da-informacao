import React, { useState, useEffect } from "react";
import api from "../../services/api";
import EditablePhoneList from "../../components/EditablePhoneList";
import EditableEmergencyContact from "../../components/EditableEmergencyContact";
import HistoricoPrivacidade from "../../components/config.privacidade/Historico";
import BannerTermosAtualizados from "../../components/config.privacidade/BannerTermosAtualizados";
import ConfigPrivacidade from "../../components/config.privacidade/ConfigPrivacidade";
import { useModal } from '../../contexts/ModalContext';
import { UserRound } from "lucide-react";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedPhones, setEditedPhones] = useState([]);
  const [consentimentoRevogado, setConsentimentoRevogado] = useState(false);
  const { showPrivacySettings, setShowPrivacySettings, privacyUserId, setPrivacyUserId } = useModal();
  const userId = user?.id || user?._id;
  const [contatoEmergencia, setContatoEmergencia] = useState({ nome: '', telefone: '' });
  const [editedNome, setEditedNome] = useState("");
  const [editedDataNascimento, setEditedDataNascimento] = useState("");
  const [editedSexo, setEditedSexo] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && (storedUser.id || storedUser._id)) {
      setUser(storedUser);
    }

    const userId = storedUser?.id
    console.log("userId", userId)

    if (!userId) return;

    async function verificarConsentimento() {
      try {
        const res = await api.get(`/consentimento/status/${userId}`);
        if (res.data.status === "revogado") {
          setConsentimentoRevogado(true);
        } else {
          setConsentimentoRevogado(false);
        }
      } catch (err) {
        console.error("Erro ao verificar status do consentimento:", err);
        setConsentimentoRevogado(false);
      }
    }

    verificarConsentimento();
  }, []);
  
  const [termosVersaoAtual, setTermosVersaoAtual] = useState(null);
  const [mostrarBannerTermos, setMostrarBannerTermos] = useState(false);

  useEffect(() => {
    async function checarVersaoTermos() {
      try {
        const token = localStorage.getItem("token");
        const [consentRes, termosRes] = await Promise.all([
          api.get(`/consentimento/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/termos/versao-atual`)
        ]);

        const consentimento = consentRes.data;
        const versaoAtual = termosRes.data;

        setTermosVersaoAtual(versaoAtual);

        if (!consentimento || consentimento.versao !== versaoAtual.versao) {
          setMostrarBannerTermos(true);
        }
      } catch (err) {
        console.error("Erro ao verificar versão dos termos:", err);
      }
    }

    if (userId) checarVersaoTermos();
  }, [userId]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/alunos/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUser = res.data.user;
        setUser(fetchedUser);
        setEditedNome(fetchedUser.nome);
        setEditedDataNascimento(fetchedUser.dataNascimento?.split("T")[0] || "");
        setEditedSexo(fetchedUser.sexo || "");
        setEditedEmail(fetchedUser.email || "");

        setEditedPhones(
          Array.isArray(fetchedUser.telefones)
            ? fetchedUser.telefones.map(t => t.numero)
            : []
        );

        setContatoEmergencia({
          nome: fetchedUser.contatoEmergencia?.nome || '',
          telefone: fetchedUser.contatoEmergencia?.telefone || ''
        });

      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSaveAllChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const updates = {
        nome: editedNome,
        email: editedEmail,
        dataNascimento: editedDataNascimento,
        sexo: editedSexo,
        telefones: editedPhones,
        contatoEmergencia
      };
      const res = await api.put("/alunos/me", updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = res.data.user;
      setUser(updated);

      setEditedPhones(
        Array.isArray(updated.telefones)
          ? updated.telefones.map(t => t.numero)
          : []
      );
      setContatoEmergencia({
        nome: updated.contatoEmergencia?.nome || '',
        telefone: updated.contatoEmergencia?.telefone || ''
      });

      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar todas as alterações:", err);
      alert("Erro ao salvar alterações. Tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!user)
    return (
      <p className="text-center mt-10 text-red-500">
        Não foi possível carregar dados do usuário.
      </p>
    );

  if (consentimentoRevogado && user) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <BannerConsentimentoRevogado
          userId={user._id}
          onVoltarConsentimento={(id) => {
            setPrivacyUserId(id);
            setShowPrivacySettings(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {mostrarBannerTermos && termosVersaoAtual && (
        <BannerTermosAtualizados
          versaoAtual={termosVersaoAtual}
          userId={user._id}
          onFechar={() => setMostrarBannerTermos(false)}
        />
      )}

      {showPrivacySettings && privacyUserId && (
        <ConfigPrivacidade
          userId={privacyUserId}
          onSave={(dados) => {
            console.log("Preferências salvas:", dados);
          }}
          onClose={() => {
            setShowPrivacySettings(false);
            setPrivacyUserId(null);
          }}
        />
      )}

      <div className="flex items-center space-x-4 max-w-4xl mx-auto mb-10">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
          <UserRound className="w-10 h-10 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold">{user.nome}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Section title="Informações Básicas">
          <EditableField
            label="Nome Completo"
            value={user.nome}
            onSave={setEditedNome}
          />
          <EditableField
            label="Email"
            value={user.email}
            onSave={setEditedEmail}
          />
          <EditableField
            label="Data de Nascimento"
            value={user.dataNascimento}
            onSave={setEditedDataNascimento}
            type="date"
          />
          <EditableField
            label="Gênero"
            value={user.sexo}
            onSave={setEditedSexo}
            type="select"
            options={[
              { label: "Homem cisgênero", value: "Homem cisgênero" },
              { label: "Mulher cisgênero", value: "Mulher cisgênero" },
              { label: "Homem transgênero", value: "Homem transgênero" },
              { label: "Mulher transgênero", value: "Mulher transgênero" },
              { label: "Outro/Prefiro não dizer", value: "Outro/Prefiro não dizer" },
            ]}
          />
          <EditableField
            label="Curso"
            value={user.curso?.nome || "--"}
            editable={false}
          />
        </Section>

        <Section title="Informações do Curso">
          <EditableField
            label="Nome do Curso"
            value={user.curso?.nome || "--"}
            editable={false}
          />
          <EditableField
            label="Modalidade"
            value={user.curso?.modalidade || "--"}
            editable={false}
          />
          <EditableField
            label="Turno"
            value={user.curso?.turno || "--"}
            editable={false}
          />
          <EditableField
            label="Duração"
            value={user.curso?.duracao || "--"}
            editable={false}
          />
        </Section>

        <Section title="Telefone(s)">
          <EditablePhoneList
            phones={editedPhones}
            onSave={setEditedPhones}
          />
        </Section>

        <Section>
          <EditableEmergencyContact
            contato={contatoEmergencia}
            onChange={setContatoEmergencia}
            onRemove={() => setContatoEmergencia({ nome: '', telefone: '' })}
          />
        </Section>
      </div>

      <div className="max-w-4xl mx-auto flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={handleSaveAllChanges}
          className="w-auto px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
        >
          Salvar Todas as Alterações
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-auto px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        >
          Sair
        </button>
      </div>
      <HistoricoPrivacidade userId={user.id || user._id} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function EditableField({ label, value, onSave, editable = true, type = "text", options = [] }) {
  const [val, setVal] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (type === "date") {
      setVal(value ? value.split('T')[0] : '');
    } else {
      setVal(value === null || value === undefined ? "" : value);
    }
  }, [value, type]);

  const finishEdit = () => {
    setEditing(false);
    let valueToSave = val;

    if (valueToSave !== value && onSave) {
      onSave(valueToSave);
    }
  };

  const displayValue = () => {
    if (type === "date" && val) {
      try {
        const date = new Date(val + 'T00:00:00');
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR');
        }
      } catch {
        return "--";
      }
    } else if (type === "select" && options.length > 0) {
      const selectedOption = options.find(option => option.value === val);
      return selectedOption ? selectedOption.label : (val || "--");
    }
    return val || "--";
  };

  return (
    <div className="flex items-center py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-600 w-32">{label}</span>
      {editing && editable ? (
        type === "select" ? (
          <select
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={finishEdit}
            className="flex-1 border-b border-gray-300 focus:outline-none"
            autoFocus
          >
            {!val && <option value="" disabled hidden>Selecione</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={val || ""}
            onChange={(e) => setVal(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => e.key === "Enter" && finishEdit()}
            autoFocus
            className="flex-1 border-b border-gray-300 focus:outline-none"
          />
        )
      ) : (
        <span
          className={`flex-1 ${editable ? "cursor-pointer" : "text-gray-600"}`}
          onClick={() => editable && setEditing(true)}
        >
          {displayValue()}
        </span>
      )}
    </div>
  );
}