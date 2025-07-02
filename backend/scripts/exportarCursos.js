require("dotenv").config();
const mongoose = require('mongoose');
const fs = require('fs');
const Curso = require('../models/Curso');

async function exportar() {
  await mongoose.connect(process.env.MONGO_URI);
  const cursos = await Curso.find().lean();
  const header = ['Nome do Curso','Modalidade','Turno','Duração','Total de Alunos'].join(',');
  const linhas = cursos.map(c => [c.nome, c.modalidade, c.turno, c.duracao, c.totalAlunos].join(','));
  fs.writeFileSync('cursos.csv', [header, ...linhas].join('\r\n'));
  console.log('cursos.csv gerado com', cursos.length, 'registros');
  mongoose.disconnect();
}

exportar().catch(console.error);