import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import api from "../../services/api";
import { IMaskInput } from "react-imask";
import { Eye, EyeOff } from 'lucide-react';

export default function Cadastro() {
  const [errors, setErrors] = useState({ nome: '', email: '', senha: '', confirmarSenha: '', curso: '' });
  const formRef = useRef();
  const [telefones, setTelefones] = useState([""]);
  const [cursos, setCursos] = useState([]);
  const [versoesPoliticas, setVersoesPoliticas] = useState({ termoUso: null, privacidade: null });
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nomeRef = useRef();
  const emailRef = useRef();
  const senhaRef = useRef();
  const confirmarSenhaRef = useRef();
  const dataRef = useRef();
  const cursoRef = useRef();
  const sexoRef = useRef();

  const [optInNews, setOptInNews] = useState(false);
  const [optInShare, setOptInShare] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState({ uso: false, privacidade: false });

  const opcoesSexo = [
    'Homem cisgênero',
    'Mulher cisgênero',
    'Homem transgênero',
    'Mulher transgênero',
    'Outro/Prefiro não dizer',
  ];

  useEffect(() => {
    api.get("/politicas/versoes")
      .then((res) => setVersoesPoliticas(res.data))
      .catch((err) => console.error("Erro ao carregar versões das políticas:", err));

    api.get("/cursos")
      .then((res) => setCursos(res.data))
      .catch((err) => console.error("Erro ao buscar cursos:", err));
  }, []);

  // Funções de validação individual
  const validateNome = () => {
    const value = nomeRef.current.value.trim();
    setErrors(prev => ({ ...prev, nome: value ? '' : 'O campo nome é obrigatório' }));
  };

  const validateEmail = () => {
    const value = emailRef.current.value.trim();
    let msg = '';
    if (!value) msg = 'O campo email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(value)) msg = 'Email inválido';
    setErrors(prev => ({ ...prev, email: msg }));
  };

  const validateCurso = () => {
    const value = cursoRef.current.value;
    setErrors(prev => ({ ...prev, curso: value ? '' : 'Selecione um curso' }));
  };

  const validateSenha = () => {
    const value = senhaRef.current.value;
    let msg = '';
    if (!value) msg = 'O campo senha é obrigatório';
    else if (value.length < 8) msg = 'A senha deve ter ao menos 8 caracteres';
    setErrors(prev => ({ ...prev, senha: msg }));
  };

  const validateConfirmarSenha = () => {
    const val = confirmarSenhaRef.current.value;
    const senhaVal = senhaRef.current.value;
    let msg = '';
    if (!val) msg = 'Confirme sua senha';
    else if (val !== senhaVal) msg = 'As senhas não coincidem';
    setErrors(prev => ({ ...prev, confirmarSenha: msg }));
  };

  function handleTelefoneChange(idx, value) {
    const lista = [...telefones];
    lista[idx] = value;
    setTelefones(lista);
  }

  function adicionarTelefone() {
    setTelefones([...telefones, ""]);
  }

  function removerTelefone(idx) {
    setTelefones(telefones.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Valida tudo antes de enviar
    validateNome();
    validateEmail();
    validateCurso();
    validateSenha();
    validateConfirmarSenha();

    if (Object.values(errors).some(msg => msg)) return;

    if (!versoesPoliticas.termoUso || !versoesPoliticas.privacidade) {
      alert("Aguarde o carregamento das versões das políticas antes de enviar.");
      return;
    }

    if (!termosAceitos.uso || !termosAceitos.privacidade) {
      alert("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      return;
    }

    const payload = {
      nome: nomeRef.current.value,
      email: emailRef.current.value.trim(),
      senha: senhaRef.current.value,
      dataNascimento: dataRef.current.value,
      curso: cursoRef.current.value,
      sexo: sexoRef.current.value,
      telefones: telefones.filter((t) => t.trim()),
      optInNews,
      optInShare,
      termosAceitos,
      versaoTermoUso: versoesPoliticas.termoUso,
      versaoPrivacidade: versoesPoliticas.privacidade,
    };

    try {
      await api.post("/cadastro", payload);
      alert("Cadastro realizado com sucesso.");
      formRef.current.reset();
      setTelefones([""]);
      setOptInNews(false);
      setOptInShare(false);
      setTermosAceitos({ uso: false, privacidade: false });
      setErrors({ nome: '', email: '', senha: '', confirmarSenha: '', curso: '' });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      alert(msg);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Cadastro</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4" id="cadastro-form">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">

            {/* Nome */}
            <label htmlFor="nome" className={`mb-1 text-sm font-medium ${errors.nome ? 'text-red-600' : 'text-gray-700'}`}>
              Nome Completo *
            </label>
            <input
              ref={nomeRef}
              name="nome"
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              className={`px-3 py-2 rounded-md focus:outline-none border ${errors.nome ? 'border-red-600' : 'border-gray-300'}`}
              onBlur={validateNome}
              onChange={() => setErrors(prev => ({ ...prev, nome: '' }))}
            />
            {errors.nome && <span className="text-red-600 text-xs mt-1">{errors.nome}</span>}
          </div>

          {/* Email */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="email" className={`mb-1 text-sm font-medium ${errors.email ? 'text-red-600' : 'text-gray-700'}`}>
              Email *
            </label>
            <input
              ref={emailRef}
              name="email"
              id="email"
              type="email"
              placeholder="Digite seu email"
              className={`px-3 py-2 rounded-md focus:outline-none border ${errors.email ? 'border-red-600' : 'border-gray-300'}`}
              onBlur={validateEmail}
              onChange={() => setErrors(prev => ({ ...prev, email: '' }))}
            />
            {errors.email && <span className="text-red-600 text-xs mt-1">{errors.email}</span>}
          </div>
        </div>

        {/* Senha */}
        <div className="flex gap-4">
          <div className="relative flex-1 flex flex-col">
            <label htmlFor="senha" className={`mb-1 text-sm font-medium ${errors.senha ? 'text-red-600' : 'text-gray-700'}`}>
              Senha *
            </label>
            <div className="relative">
              <input
                ref={senhaRef}
                name="senha"
                id="senha"
                type={showSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className={`w-full h-10 px-3 pr-10 rounded-md focus:outline-none border ${errors.senha ? 'border-red-600' : 'border-gray-300'}`}
                onBlur={validateSenha}
                onChange={() => setErrors(prev => ({ ...prev, senha: '' }))}
              />
              <button type="button" onClick={() => setShowSenha(v => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.senha && <span className="text-red-600 text-xs mt-1">{errors.senha}</span>}
          </div>

          {/* Confirmar Senha */}
          <div className="relative flex-1 flex flex-col">
            <label htmlFor="confirmarSenha" className={`mb-1 text-sm font-medium ${errors.confirmarSenha ? 'text-red-600' : 'text-gray-700'}`}>
              Confirmar Senha *
            </label>
            <div className="relative flex-1">
              <input
                ref={confirmarSenhaRef}
                name="confirmarSenha"
                id="confirmarSenha"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repita sua senha"
                className={`w-full h-10 px-3 pr-10 rounded-md focus:outline-none border ${errors.senha ? 'border-red-600' : 'border-gray-300'}`}
                onBlur={validateConfirmarSenha}
                onChange={() => setErrors(prev => ({ ...prev, confirmarSenha: '' }))}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmarSenha && <span className="text-red-600 text-xs mt-1">{errors.confirmarSenha}</span>}
          </div>
        </div>

        {/* Data de Nascimento */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label htmlFor="dataNascimento" className="mb-1 text-sm font-medium text-gray-700">Data de Nascimento</label>
            <input ref={dataRef} type="date" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none" />
          </div>

          {/* Gênero */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="Genero" className="mb-1 text-sm font-medium text-gray-700">Gênero</label>
            <select ref={sexoRef} defaultValue="" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none">
              <option value="">Selecione o gênero</option>
              {opcoesSexo.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Curso */}
        <div className="flex flex-col">
          <label htmlFor="curso" className={`mb-1 text-sm font-medium ${errors.curso ? 'text-red-600' : 'text-gray-700'}`}>Curso *</label>
          <select
            ref={cursoRef}
            id="curso"
            className={`px-3 py-2 rounded-md focus:outline-none border ${errors.curso ? 'border-red-600' : 'border-gray-300'}`}
            onBlur={validateCurso}
            onChange={() => setErrors(prev => ({ ...prev, curso: '' }))}
          >
            <option value="">Selecione um curso</option>
            {cursos.map((c) => (
              <option key={c._id} value={c._id}>{c.nome}</option>
            ))}
          </select>
          {errors.curso && <span className="text-red-600 text-xs mt-1">{errors.curso}</span>}
        </div>

        {/* Telefone */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Telefone(s)</label>
          {telefones.map((tel, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <IMaskInput
                mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
                value={tel}
                onAccept={(value) => handleTelefoneChange(idx, value)}
                placeholder={`Telefone ${idx + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              {telefones.length > 1 && (
                <button type="button" onClick={() => removerTelefone(idx)} className="text-red-500 text-sm hover:underline">
                  Remover
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={adicionarTelefone} className="self-start px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700">
            + Adicionar Telefone
          </button>
        </div>

        {/* Opt‑ins */}
        <div className="space-y-4 mt-6">
          <div className="border border-gray-200 rounded-md p-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={optInNews}
                onChange={(e) => setOptInNews(e.target.checked)}
                className="mt-1"
              />
              <div>
                <p className="font-medium">Quero receber novidades e avisos por e-mail (Opcional)</p>
                <p className="text-sm text-gray-600">Permite o envio de novidades, atualizações e comunicados.</p>
              </div>
            </label>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={optInShare}
                onChange={(e) => setOptInShare(e.target.checked)}
                className="mt-1"
              />
              <div>
                <p className="font-medium">Autorizo o compartilhamento de meus dados com parceiros (Opcional)</p>
                <p className="text-sm text-gray-600">Você pode revogar esta permissão a qualquer momento.</p>
              </div>
            </label>
          </div>
        </div>
        {/* Termos */}
        <div className="border border-gray-200 rounded-md p-3 mt-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termosAceitos.uso}
              onChange={(e) => setTermosAceitos((p) => ({ ...p, uso: e.target.checked }))}
              className="mt-1"
            />
            <p className="font-medium">Eu concordo com os <Link to="/termos-de-uso" className="text-blue-500 underline" target="_blank">Termos de Uso</Link> (Obrigatório)</p>
          </label>
        </div>
        <div className="border border-gray-200 rounded-md p-3 mt-2">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={termosAceitos.privacidade}
              onChange={(e) => setTermosAceitos((p) => ({ ...p, privacidade: e.target.checked }))}
              className="mt-1"
            />
            <p className="font-medium">Eu concordo com a <Link to="/politica-de-privacidade" className="text-blue-500 underline" target="_blank">Política de Privacidade</Link> (Obrigatório)</p>
          </label>
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >Cadastrar-se</button>
      </form >
      <Link to="/login" className="text-blue-500 hover:underline mt-4 block text-center">Já tem uma conta? Faça login</Link>
      <p className="text-xs text-gray-500 mt-4 text-center">Seus dados são tratados conforme a LGPD.</p>
    </div >
  );
}