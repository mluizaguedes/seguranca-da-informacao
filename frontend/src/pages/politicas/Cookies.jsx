import React from "react";
import "./index.css";

export default function PoliticaDeCookies() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">
        Política de Cookies e Tecnologias Similares
      </h1>

      <p className="mb-4">Atualizado em 05 de Junho de 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. O que são cookies?</h2>
      <p className="mb-4">
        Cookies são pequenos arquivos de texto armazenados no seu dispositivo
        (computador, smartphone, tablet) quando você acessa um site. Eles servem
        para garantir o funcionamento adequado do site, melhorar sua experiência
        de navegação, coletar dados estatísticos e lembrar suas preferências.
      </p>
      <p className="mb-4">
        Nenhum dos dados armazenados ou recuperados será vendido, usado para
        marketing ou para lembrar de outros sites que você visitou na internet.
        Nós não usamos publicidade direcionada nem cookies de marketing.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Tipos de cookies que utilizamos
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Cookies Essenciais (Necessários):</strong> São indispensáveis
          para o funcionamento do site, permitindo funcionalidades básicas como
          navegação, acesso seguro e preenchimento de formulários. Estes cookies
          não armazenam informações pessoais identificáveis e não podem ser
          desativados.
        </li>
        <li>
          <strong>Cookies de funções:</strong> São utilizados para que o site
          lembre das escolhas que você já fez (como nome de usuário, idioma e
          região) e forneça recursos aprimorados. Esses cookies melhoram sua
          experiência no nosso site, fazem com que ele funcione melhor e
          permitem que você configure o site de acordo com as suas preferências.
        </li>
        <li>
          <strong>Cookies de Análise e Desempenho:</strong> Coletam informações
          sobre como os visitantes interagem com o site, como páginas visitadas
          e tempo gasto. Esses dados são usados de forma anônima e ajudam a
          melhorar a performance do site.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Consentimento e gerenciamento de cookies
      </h2>
      <p className="mb-4">
        Ao acessar nosso site pela primeira vez, você pode optar por aceitar
        apenas os cookies essenciais, aceitar todos os cookies ou personalizar
        suas preferências. Seu consentimento é armazenado localmente e pode ser
        alterado a qualquer momento. Note que, ao mudar suas preferências, isso
        não vai deletar os cookies existentes. Se você quiser deletar os cookies
        deste site, pode fazer isso nas configurações do seu navegador. No
        entanto, esteja ciente que, sem os cookies, você talvez não consiga
        aproveitar todos os recursos de nosso site. O procedimento para eliminar
        os cookies varia de um navegador para outro. Para obter informações
        sobre isso, veja a seção Ajuda do seu navegador ou visite
        www.allaboutcookies.org.
      </p>

      <p className="mb-4">
        Para alterar ou revogar seu consentimento, acesse a seção de{" "}
        <strong>Configurações de Privacidade</strong> ou limpe os dados do
        navegador para redefinir suas escolhas.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Seus direitos segundo a LGPD
      </h2>
      <p className="mb-4">
        De acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº
        13.709/2018), você tem os seguintes direitos:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Confirmar a existência de tratamento de dados;</li>
        <li>Acessar seus dados pessoais armazenados por nós;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>
          Solicitar a exclusão de dados tratados com base em seu consentimento;
        </li>
        <li>
          Revogar seu consentimento para o uso de cookies não essenciais a
          qualquer momento.
        </li>
      </ul>

      <p className="mt-8 text-sm text-gray-500">
        Última atualização: Junho de 2025
      </p>
    </div>
  );
}
