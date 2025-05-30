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

Simula um sistema de detecção de incidentes de segurança. Ele representa uma situação onde, ao ocorrer uma tentativa de invasão, o sistema realiza três ações principais de forma automática:

- 🔔 **Notifica todos os usuários cadastrados via email.**
- 💾 **Gera um backup completo do banco de dados (usuários e incidentes).**
- 🗒️ **Registra o incidente no banco de dados para consulta posterior.**

---

### ✅ Funcionamento 

| Ação | Descrição |
| --- | --- |
| `index.js` | Backend que gerencia usuários, incidentes, logs e backups. |
| `triggerIncident.js` | Simula uma invasão, dispara o incidente, envia notificações e gera backup. |
| **Backup automático** | Gera `backup.json` com dados de usuários e incidentes sempre que há ataque. Por segurança, o backup está incluído no `.gitignore` para **não subir no GitHub**. |
| **Notificação automática por email** | Todos os usuários recebem email sobre o incidente assim que ele ocorre. |

---

### 🚀 Tecnologias utilizadas

- **Node.js** (servidor backend)
- **Express** (API REST)
- **MongoDB + Mongoose** (banco de dados)
- **Nodemailer** (envio de emails de notificação)
- **Axios** (usado no script de simulação da invasão)

### 📁 Estrutura
- [Backend](https://github.com/juliagonzalezmoreira/seguranca-da-informacao/tree/main/backend)	/ API REST em Node.js com MongoDB.
- [Frontend](https://github.com/juliagonzalezmoreira/seguranca-da-informacao/tree/main/frontend)	/ Interface React.
- ```README.md```  Informações do projeto.

---
<details>
<summary> ⚙️ Como rodar o projeto </summary>

### 🔧 1️⃣ Instale as dependências:

```bash
npm install
```

---

### 🔑 2️⃣ Configure o arquivo `.env` com seus dados:

```
MONGO_URI=mongodb://localhost:27017/seu-banco
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua-senha-de-app
```

> ⚠️ Observação: Use uma senha de aplicativo para Gmail ou outro serviço SMTP. 

---

### ▶️ 3️⃣ Inicie o backend:

```bash
node index.js
```

### 💥 Como simular uma invasão

Execute o script:

```bash
node triggerIncident.js
```

</details>

</details>
