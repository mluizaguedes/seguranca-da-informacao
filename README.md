# Segurança da Informação
Trabalho da disciplina Segurança da Informação

## Integrantes:
* Julia Gonzalez
* Maria Luiza Guedes
* Sofia Lessa
  
## Itens LGPD
1. Portabilidade
2. OPT-IN
3. Transparência


<details>
  <summary> 🔐 Notificação </summary>
  
  ---
  
## 🔐 Notificação

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
