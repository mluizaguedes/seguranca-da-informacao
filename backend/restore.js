const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

function restoreLatestBackup() {
  return new Promise((resolve, reject) => {
    const baseDir = process.env.BACKUP_DIR || path.join(__dirname, 'backups');

    const backups = fs.readdirSync(baseDir)
      .filter(name => name.startsWith('dump-'))
      .sort()
      .reverse();

    if (backups.length === 0) {
      return reject(new Error('Nenhum backup disponível.'));
    }

    const latest = path.join(baseDir, backups[0]);
    const cmd = `mongorestore --drop --uri="${process.env.MONGO_URI}" "${latest}"`;

    exec(cmd, (err) => {
      if (err) {
        console.error('❌ Erro na restauração:', err.message);
        return reject(err);
      }
      console.log('✅ Backup restaurado de:', latest);
      resolve({ restoredDir: latest });
    });
  });
}

module.exports = { restoreLatestBackup };
