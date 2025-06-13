import React from "react";
import "./index.css";

export default function PoliticaDePrivacidade() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Política de Privacidade
      </h1>

      <p className="mb-4">Atualizado em 05 de Junho de 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Compromisso com a Privacidade
      </h2>
      <p className="mb-4">
        Nós valorizamos a privacidade dos nossos usuários e estamos
        comprometidas com a proteção dos dados pessoais conforme a Lei Geral de
        Proteção de Dados (Lei nº 13.709/2018 - LGPD).
      </p>
      <p className="mb-4">
        Esta Política de Privacidade explica como coletamos, usamos, armazenamos
        e compartilhamos os dados pessoais dos usuários cadastrados em nosso
        portal institucional.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Seus direitos segundo a LGPD
      </h2>
      <p className="mb-4">
        No momento do cadastro ou uso do portal, podemos coletar os seguintes
        dados:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Nome completo;</li>
        <li>E-mail</li>
        <li>Senha (armazenada de forma segura e criptografada);</li>
        <li>Data de nascimento;</li>
        <li>CPF;</li>
        <li>Curso escolhido;</li>
        <li>Telefones de contato;</li>
        <li>
          Preferências de comunicação (opt-in para e-mails e compartilhamento de
          dados);
        </li>
        <li>Informações sobre consentimento de cookies e de privacidade;</li>
        <li>Dados de navegação por meio de cookies (quando autorizado).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Para que usamos seus dados
      </h2>
      <p className="mb-4">Os dados coletados têm as seguintes finalidades:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Realizar o cadastro e autenticação de alunos no sistema;</li>
        <li>
          Comunicar eventos, avisos e informações institucionais por e-mail
          (caso autorizado);
        </li>
        <li>
          Compartilhar com parceiros educacionais para fins acadêmicos e
          promocionais (caso autorizado);
        </li>
        <li>Cumprir obrigações legais e regulatórias;</li>
        <li>
          Gerar estatísticas e relatórios internos para melhoria dos serviços;
        </li>
        <li>
          Garantir a segurança do sistema e prevenir fraudes (ex: bloqueio de
          injeções ou ataques).
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Compartilhamento de dados com terceiros
      </h2>
      <p className="mb-4">
        Se você consentir, poderemos compartilhar seus dados com parceiros
        educacionais, como instituições de intercâmbio, editoras acadêmicas e
        plataformas de cursos.
      </p>
      <p className="mb-4">O compartilhamento ocorre apenas:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Com sua autorização prévia;</li>
        <li>Com finalidades educacionais ou de benefícios ao aluno;</li>
        <li>Com parceiros que também estejam adequados à LGPD.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Cookies e tecnologias de rastreamento
      </h2>
      <p className="mb-4">Utilizamos cookies para:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Armazenar preferências do usuário;</li>
        <li>Melhorar a experiência de navegação;</li>
        <li>Coletar dados estatísticos de acesso ao site.</li>
      </ul>
      <p className="mb-4">
        Você pode aceitar ou recusar o uso de cookies não essenciais a qualquer
        momento por meio do painel de preferências.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Segurança e armazenamento dos dados
      </h2>
      <p className="mb-4">
        Adotamos medidas técnicas e organizacionais para proteger os dados
        pessoais contra acesso não autorizado, destruição, perda ou alteração.
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Os dados são armazenados em servidores seguros;</li>
        <li>Backups periódicos são realizados;</li>
        <li>
          Incidentes de segurança são registrados e notificados aos usuários
          impactados, conforme obrigações legais.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Seus direitos como titular de dados
      </h2>
      <p className="mb-4">Você tem os seguintes direitos:</p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Confirmar a existência do tratamento;</li>
        <li>Acessar seus dados;</li>
        <li>Corrigir dados incompletos ou desatualizados;</li>
        <li>Revogar consentimentos.</li>
      </ul>
      <p className="mb-4">
        Para exercer seus direitos, entre em contato pelo e-mail:
        privacidade@example.edu.br
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Alterações nesta política
      </h2>
      <p className="mb-4">
        Esta Política pode ser atualizada periodicamente. Notificaremos os
        usuários em caso de mudanças relevantes. Recomendamos que consulte esta
        página regularmente.
      </p>

      <p className="mb-4">
        ✔ Ao continuar usando nosso site, você concorda com esta Política de
        Privacidade.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Última atualização: Junho de 2025
      </p>
    </div>
  );
}
