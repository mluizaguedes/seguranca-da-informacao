const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runBackup() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseDir = process.env.BACKUP_DIR;
    const mongoUri = process.env.MONGO_URI;

    if (!baseDir) return reject(new Error('Variável de ambiente BACKUP_DIR não definida'));
    if (!mongoUri) return reject(new Error('Variável de ambiente MONGO_URI não definida'));

    const backupDir = path.join(baseDir, `dump-${timestamp}`);

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
    fs.mkdirSync(backupDir);

    const cmd = `mongodump --uri="${mongoUri}" --out="${backupDir}"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ backupDir });
    });
  });
}

//Procura o backup mais recente e restaura com mongorestore
async function restoreLatestBackup() {
  return new Promise((resolve, reject) => {
    const baseDir = process.env.BACKUP_DIR;
    if (!fs.existsSync(baseDir)) return reject(new Error('Backup directory não encontrado'));

    const dirs = fs.readdirSync(baseDir)
      .filter(name => name.startsWith('dump-'))
      .sort()
      .reverse();

    if (dirs.length === 0) return reject(new Error('Nenhum backup encontrado'));

    const latest = path.join(baseDir, dirs[0]);
    const cmd = `mongorestore --drop --uri="${process.env.MONGO_URI}" "${latest}"`;
    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve({ restoredDir: latest });
    });
  });
}

module.exports = { runBackup, restoreLatestBackup };