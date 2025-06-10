
# 🛡️ Documentação de Backup e Resposta a Incidentes

## 📁 Estrutura de Arquivos

Os scripts a seguir estão localizados na raiz do backend:

- `backup.js` → Gera backup manual ou programado
- `cleanup.js` → Remove backups antigos (com mais de 90 dias)
- `restore.js` → Restaura o último backup disponível
- `triggerIncident.js` → Dispara a resposta completa a um incidente
- `backup_diario.bat` → Roda `backup.js` diariamente (via Agendador de Tarefas)
- `limpeza.bat` → Roda `cleanup.js` a cada 90 dias (via Agendador de Tarefas)

## ✅ Como Agendar Backup e Limpeza

Use o **Agendador de Tarefas do Windows** para executar:

- `backup_diario.bat` → Executar **diariamente**
- `limpeza.bat` → Executar **a cada 90 dias**

Esses `.bat` usam `cd /d "%~dp0"` para rodar os scripts sem expor caminhos absolutos.

---

## 🗃️ Como Criar um Backup Manual

1. Verifique se o `.env` tem a variável `MONGO_URI` corretamente configurada.
2. Execute o comando:

```bash
node backup.js
```

- O backup será salvo em uma pasta `backups/dump-YYYY-MM-DD-HH-MM-SS`.

---

## ♻️ Como Limpar Backups Antigos

```bash
node cleanup.js
```

- Remove todos os backups com mais de **90 dias** (baseado na data de criação da pasta).

---

## 🧯 Como Restaurar Manualmente o Backup

```bash
node restore.js
```

- Restaura o **backup mais recente** salvo na pasta `backups`.

---

## 🚨 Caso Haja Invasão

### 🔍 Sinais Comuns de Invasão

- Requisições com parâmetros suspeitos como:
  - `$ne`, `$or`, `$regex`, `$gt`, `$exists`, etc.
- Padrões anormais de acesso
- Dados corrompidos ou ausentes
- Stack traces incomuns em logs
- Alterações inesperadas em documentos

---

### ⚠️ Ação Imediata

> **Intervenção rápida é essencial para evitar maiores danos.**

Execute o seguinte comando no terminal:

```bash
node triggerIncident.js
```

---

### ✅ O que esse comando faz automaticamente

1. **Registra o incidente no banco**
2. **Envia e-mails de alerta para todos os usuários cadastrados**
3. **Restaura o backup mais recente**
4. **Cria um novo backup pós-restauração**
5. **Executa a limpeza de backups antigos (90+ dias)**

---

## 📫 Notificação aos Usuários

Cada usuário receberá um e-mail com o seguinte conteúdo:

```
Assunto: 🚨 Incidente de Segurança

Olá [Nome do usuário],

Detectamos uma atividade maliciosa no sistema. Por precaução, restauramos seus dados com base no último backup confiável.

Caso tenha dúvidas, entre em contato com a equipe técnica.

Equipe de Segurança
```

---

## 📌 Observações Finais

- Todos os scripts devem estar na raiz do backend.
- O MongoDB Tools (`mongodump` e `mongorestore`) devem estar no `PATH` do sistema.
- O `.env` deve conter:
  ```
  MONGO_URI=mongodb+srv://<user>:<senha>@<cluster>.mongodb.net/<db>
  BACKUP_DIR=./backup
  ```

---

📝 **Criado por:** Julia Gonzalez Moreira 

📅 **Data:** Junho/2025  

📤 **Destinado a:** Próximo responsável pelo projeto

---
