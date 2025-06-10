const fs = require('fs');
const path = require('path');
require('dotenv').config();

function cleanupOldBackups(dias = 90) {
  return new Promise((resolve, reject) => {
    const dir = process.env.BACKUP_DIR || path.join(__dirname, 'backups');
    const limite = Date.now() - dias * 24 * 60 * 60 * 1000;

    if (!fs.existsSync(dir)) {
      console.error('❌ Pasta de backups não encontrada:', dir);
      return resolve();
    }

    fs.readdirSync(dir).forEach(nome => {
      const fullPath = path.join(dir, nome);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory() && stats.ctimeMs < limite) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log('🗑️ Backup apagado:', nome);
      }
    });

    resolve();
  });
}

module.exports = { cleanupOldBackups };
