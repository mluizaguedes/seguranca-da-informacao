import React from "react";
import "../../components/index.css";

export default function Termos() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Termos de Uso</h1>

      <p className="mb-4">Atualizado em 05 de Junho de 2025</p>

      <p className="mb-4">
        Seja bem-vindo(a)! Ao acessar e usar esse site, você concorda com estes
        Termos de Uso e se compromete a respeitá-los. Recomendamos a leitura
        atenta deste documento.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. IDENTIFICAÇÃO</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Este site é mantido e operado por:</strong> Julia Gonzalez,
          Maria Luiza Guedes e Sofia Lessa
        </li>
        <li>
          <strong>E-mail de contato:</strong> site@exemplo.com
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. OBJETIVO DO SITE</h2>
      <p className="mb-4">
        O site oferece funcionalidades para que o(a) usuário(a) possa:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Criar uma conta com dados pessoais básicos;</li>
        <li>Registrar consentimentos relacionados à privacidade;</li>
        <li>Escolher receber ou não comunicações por e-mail;</li>
        <li>Compartilhar ou não dados com parceiros educacionais;</li>
        <li>Acompanhar o histórico de consentimentos;</li>
        <li>Utilizar recursos protegidos e seguros.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. ACEITAÇÃO DOS TERMOS
      </h2>
      <p className="mb-4">
        Ao criar uma conta ou utilizar qualquer funcionalidade do aplicativo,
        o(a) usuário(a) declara ter lido, compreendido e aceito integralmente
        estes Termos de Uso, bem como a Política de Privacidade.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. CADASTRO DE USUÁRIO
      </h2>
      <p className="mb-4">Para utilizar os recursos oferecidos:</p>
      <li>O(a) usuário(a) deve fornecer informações verídicas e completas;</li>
      <li>O uso indevido de dados de terceiros é proibido.</li>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. RESPONSABILIDADES DO USUÁRIO
      </h2>
      <p className="mb-4">O usuário se compromete a:</p>
      <li>Não utilizar o app para fins ilícitos ou fraudulentos;</li>
      <li>Manter seus dados de acesso confidenciais;</li>
      <li>Respeitar os direitos de terceiros;</li>
      <li>Utilizar os recursos conforme os limites da lei e deste termo</li>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. FUNCIONALIDADES ADICIONAIS
      </h2>
      <p className="mb-4">
        <strong>Consentimento: </strong>O usuário poderá, a qualquer momento,
        visualizar e revogar consentimentos dados sobre:
      </p>
      <li>Recebimento de novidades e comunicados por e-mail;</li>
      <li>Compartilhamento de dados com parceiros educacionais;</li>
      <li>Utilização de cookies não essenciais (funcionalidade e análise).</li>
      <p>
        Essas escolhas podem ser feitas no menu “Configurações de Privacidade”.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. PROPRIEDADE INTELECTUAL
      </h2>
      <p className="mb-4">
        Todo o conteúdo do site (layout, textos, imagens, código, marcas) é de
        propriedade da desenvolvedora e protegido pela legislação vigente. É
        proibida a reprodução, modificação ou distribuição sem autorização
        prévia.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. LIMITAÇÃO DE RESPONSABILIDADE
      </h2>
      <p className="mb-4">
        Apesar dos esforços para manter a segurança, o site pode apresentar
        interrupções temporárias ou erros técnicos. A empresa não se
        responsabiliza por:
      </p>
      <li>Falhas de conexão de internet;</li>
      <li>Atos de terceiros mal-intencionados;</li>
      <li>Uso indevido da conta por terceiros.</li>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. SEGURANÇA E AUDITORIA
      </h2>
      <p className="mb-4">
        Todos os acessos são monitorados com registros de logs para fins de
        auditoria. Em caso de incidentes de segurança, os usuários serão
        notificados conforme previsto na LGPD.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. ALTERAÇÕES DOS TERMOS
      </h2>
      <p className="mb-4">
        Estes Termos podem ser modificados a qualquer momento. As alterações
        entrarão em vigor após publicação, sendo recomendada a revisão
        periódica.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Se você tiver dúvidas, entre em contato conosco por e-mail: site@exemplo.com
      </p>
    </div>
  );
}
