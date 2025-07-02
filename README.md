<h1 align="center">
 🔒 Segurança da Informação
</h1>

<p align="center">
	<b><i>
Trabalho da disciplina Segurança da Informação 
  </i></b>
</p>

<p align="center">
	<img alt="Tamanho do código no GitHub em bytes" src="https://img.shields.io/github/languages/code-size/juliagonzalezmoreira/seguranca-da-informacao?color=6272a4" />
	<img alt="Linguagem principal" src="https://img.shields.io/github/languages/top/juliagonzalezmoreira/seguranca-da-informacao?color=6272a4"/>
</p>

## 💡 Sobre o projeto

### 👥 Integrantes:
* Julia Gonzalez
* Maria Luiza Guedes
* Sofia Lessa
  
### 📍 Itens LGPD
1. Transparência
2. OPT-IN
3. Notificação

---

<details>
  <summary> Transparência </summary>

  ---
  
## Transparência

Este projeto implementa um portal universitário com foco em **transparência** por meio de um sistema **CRUD** (Create, Read, Update). Os usuários podem gerenciar completamente suas contas como se cadastrar, atualizar e visualizar suas informções, garantindo controle total sobre seus dados.

## Funcionalidades

| Ação       | Descrição                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| **CREATE** | Cadastro de nova conta com informações básicas (nome, e-mail, data de nascimento, sexo).                    |
| **READ**   | Exibição detalhada dos dados do usuário na página **Perfil**, incluindo as informações do curso do usuário. |
| **UPDATE** | Permite edição de qualquer campo cadastrado a qualquer momento.                                             |

---

## Tabela de Modelagem de Dados

A tabela a seguir detalha a estrutura dos modelos `User` e `Curso`, com informações sobre cada campo, seu tipo, obrigatoriedade e considerações sobre a LGPD.

### Modelo `User`

| Campo | Tipo de Dado | Obrigatório | Descrição e Finalidade | Implicações da LGPD |
| --- | --- | --- | --- | --- |
| `nome` | String | Sim | Nome completo do usuário. | Dado pessoal comum, essencial para identificação. |
| `email` | String | Sim | Endereço de e-mail do usuário. | Dado pessoal comum, usado para login e comunicação. |
| `senha` | String | Sim | Senha do usuário. | Dado pessoal comum, **armazenada com hash.** |
| `dataNascimento` | Date | Não | Data de nascimento do usuário. | Dado pessoal, coleta opcional. |
| `sexo` | String (enum) | Não | Gênero do usuário. | **Dado pessoal sensível,** coleta opcional. |
| `curso` | ObjectId (ref: 'Curso') | Sim | ID do curso do usuário. | Dado pessoal comum, essencial para a funcionalidade. |
| `telefones` | Array de `telefoneSchema` | Não | Lista de telefones do usuário. | Dado pessoal comum, coleta opcional. |
| `contatoEmergencia` | `contatoEmergenciaSchema` | Não | Contato de emergência do usuário. | **Dado pessoal de terceiro.** Coleta opcional, com base legal clara. |

### Modelo `Curso`

| Campo | Tipo de Dado | Obrigatório | Descrição e Finalidade | Implicações da LGPD |
| --- | --- | --- | --- | --- |
| `nome` | String | Sim | Nome do curso. | Não é um dado pessoal. |
| `modalidade` | String | Sim | Modalidade do curso. | Não é um dado pessoal. |
| `turno` | String | Sim | Turno do curso. | Não é um dado pessoal. |
| `duracao` | String | Sim | Duração do curso. | Não é um dado pessoal. |
| `totalAlunos` | Number | Não | Total de alunos no curso. | Dado agregado. Não é um dado pessoal. |


---

## 💡 Caso de Uso: Transparência de Dados do Usuário

1. **Cadastro:** Usuário se cadastra para acessar o site da faculdade, apenas os campos básicos como nome, email, senha e curso são obrigatórios no registro. 
2. **Login:** Usuário acessa o portal com e-mail e senha.
3. **Dados Pessoais:** Ao logar, o usuário visualiza todas suas informações.
4. **Edição Dados:** Na página de Perfil o usuário tem permissão para editar seus dados.

---

## 🛠️ Tecnologias

* **Backend:** Node.js, Express
* **Banco de Dados:** MongoDB, Mongoose
* **Frontend:** React, JavaScript, Tailwind CSS
* **Autenticação:** JSON Web Tokens (JWT)

---

<details>
  <summary> ⚙️ Como Rodar</summary>

### 🖥️ Backend

1. Acesse `backend`:

   ```bash
   cd backend
   ```
2. Instale dependências:

   ```bash
   npm install
   ```
3. Crie `.env` seguindo o template:

  ```env
  MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>
  MAIL_HOST=smtp.mailserver.com
  MAIL_PORT=587
  MAIL_USER=your_email@example.com
  MAIL_PASS=your_email_password
  BACKUP_DIR=caminho\para\salvar\backups
  JWT_SECRET="coloque uma chave aqui"
  ```

4. Inicie o servidor:

   ```bash
   node index.js
   ```

### 🌐 Frontend

1. Acesse `frontend`:

   ```bash
   cd frontend
   ```
2. Instale dependências:

   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

---
</details>

</details>

<details>
  <summary> 📢 Notificação </summary>
  
  ---
  
## 📢 Notificação

Este projeto simula uma solução automatizada de segurança para proteção de dados sensíveis armazenados em um banco MongoDB, integrando backup local, detecção de injeção NoSQL, restauração automática e notificação por email aos usuários.

## ✅ Funcionalidades

| Ação | Descrição |
|------|-----------|
| 🛡️ Detecção de ataque | Middleware detecta tentativas de injeção NoSQL nos endpoints |
| 📦 Backup automático | Geração diária de backup via script `.bat` agendado no Windows |
| 🔁 Restauração | Em caso de ataque, restaura automaticamente o último backup |
| ✉️ Notificação por email | Envia email corporativo a todos os usuários em caso de incidente |
| 🗂️ Registro de incidentes | Salva cada incidente no banco com lista de usuários notificados |

## 📁 Estrutura de Arquivos

```
backend/
├── backup.js              # Função para criar backups
├── cleanup.js             # Remove backups antigos (>90 dias)
├── restore.js             # Restaura último backup válido
├── triggerIncident.js     # Simula invasão (ou pode ser usado em produção via POST /incident)
├── index.js               # API principal com middleware de segurança
├── notifications.js       # Envio de email usando Nodemailer
├── models/
│   ├── User.js            # Modelo de usuário
│   └── Incident.js        # Modelo de incidente
├── backup_diario.bat      # Script agendável para backup diário via Task Scheduler
├── limpeza.bat            # Script de limpeza automática dos backups antigos
├── .env                   # Variáveis de ambiente (oculto)
└── README.md              # Este arquivo
```

## 💼 Caso de Uso: Detecção de Invasão

Se for detectada uma tentativa de injeção maliciosa no corpo da requisição, o sistema:

1. Registra o incidente no MongoDB
2. Envia um **email corporativo** para todos os usuários explicando o ocorrido e instruções para segurança
3. Restaura o banco de dados a partir do backup mais recente
4. Gera um novo backup pós-incidente para análise futura

## 🛠️ Tecnologias Utilizadas

- Node.js + Express (API)
- MongoDB + Mongoose (Banco de dados)
- Nodemailer (Envio de emails)
- Axios (Simulação de ataque)
- Windows Task Scheduler (Agendamento de scripts .bat)
- `mongodump` (CLI oficial do MongoDB para backups)

<details>
  <summary> ⚙️ Como Rodar</summary>

### 1️⃣ Instale as dependências

```bash
npm install
```

### 2️⃣ Configure seu `.env`:

```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>
MAIL_HOST=smtp.mailserver.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
BACKUP_DIR=caminho\para\salvar\backups
```

> ⚠️ Use uma senha de aplicativo para Gmail ou SMTP corporativo

### 3️⃣ Inicie o servidor

```bash
npm start
```

### 4️⃣ Teste o incidente

```bash
node triggerIncident.js
```

## 🗓️ Backup Diário Automático

Configure o **Agendador de Tarefas do Windows** para rodar o arquivo `backup_diario.bat` diariamente.

</details>

</details>
