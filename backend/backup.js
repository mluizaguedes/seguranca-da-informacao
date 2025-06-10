const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

function runBackup() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseDir = process.env.BACKUP_DIR || path.join(__dirname, 'backups');
    const mongoUri = process.env.MONGO_URI;
    const backupDir = path.join(baseDir, `dump-${timestamp}`);

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(backupDir);

    const cmd = `mongodump --uri="${mongoUri}" --out="${backupDir}"`;
    exec(cmd, (err) => {
      if (err) {
        console.error('❌ Erro no backup:', err.message);
        return reject(err);
      }
      console.log('✅ Backup criado em:', backupDir);
      resolve({ backupDir });
    });
  });
}

module.exports = { runBackup };
