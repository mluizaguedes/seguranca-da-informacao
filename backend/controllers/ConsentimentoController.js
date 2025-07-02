const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Consentimento = require("../models/Consentimento");
const HistoricoLog = require("../models/HistoricoLog");
const TermoVersao = require("../models/TermoVersao");

const router = express.Router();

router.post("/consentimento", auth, async (req, res) => {
  const userId = req.userId;
  const { versao, respostas } = req.body;

  if (!versao || typeof respostas !== "object") {
    return res
      .status(400)
      .json({ error: "Versão e respostas são obrigatórias." });
  }

  const termo = await TermoVersao.findOne({ versao });
  if (!termo) {
    return res.status(400).json({ error: "Versão de termos não encontrada." });
  }

  await Consentimento.updateMany(
    { userId, isCurrent: true },
    { $set: { isCurrent: false } }
  );

  const novoConsentimento = new Consentimento({
    userId,
    versao,
    respostas: new Map(Object.entries(respostas)),
    isCurrent: true,
  });

  await novoConsentimento.save();

  await HistoricoLog.create({
    userId,
    acao: "CONSENTIMENTO_ATUALIZADO",
    detalhes: {
      versao,
      respostas,
    },
    origem: "web",
  });

  res.status(201).json({ message: "Consentimento salvo com sucesso." });
});

router.get("/consentimento/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const consent = await Consentimento.findOne({
      userId,
      isCurrent: true,
    });

    if (!consent) {
      return res.status(404).json({ error: "Consentimento não encontrado" });
    }

    res.json({
      versao: consent.versao,
      respostas: Object.fromEntries(consent.respostas),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar consentimento" });
  }
});

router.get("/privacidade/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const logs = await HistoricoLog.find({ userId }).sort({ createdAt: -1 });
    const logsComTermos = [];

    for (const log of logs) {
      const { detalhes } = log.toObject();

      if (detalhes?.versao) {
        const termo = await TermoVersao.findOne({ versao: detalhes.versao });

        if (termo) {
          log.detalhes.termos = termo.termos;
        }
      }

      logsComTermos.push(log);
    }

    res.json(logsComTermos);
  } catch (err) {
    console.error("Erro ao buscar logs de privacidade:", err);
    res.status(500).json({ error: "Erro ao buscar histórico de consentimento" });
  }
});

router.put("/consentimento/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const { versao, respostas } = req.body;

  if (String(req.userId) !== String(userId)) {
    return res.status(403).json({ error: "Permissão negada." });
  }

  try {
    const termo = await TermoVersao.findOne({ versao });
    if (!termo) {
      return res.status(400).json({ error: "Versão de termos não encontrada." });
    }

    // Desativa anterior
    await Consentimento.updateMany({ userId, isCurrent: true }, { $set: { isCurrent: false } });

    // Cria novo consentimento
    const novoConsentimento = new Consentimento({
      userId,
      versao,
      respostas: new Map(Object.entries(respostas)),
      isCurrent: true,
    });
    await novoConsentimento.save();

    // Log
    await HistoricoLog.create({
      userId,
      acao: "CONSENTIMENTO_ATUALIZADO",
      detalhes: {
        versao,
        respostas
      },
      respostas,
      origem: "web",
    });

    res.json({ message: "Consentimento atualizado." });
  } catch (err) {
    console.error("Erro ao atualizar consentimento:", err);
    res.status(500).json({ error: "Erro ao atualizar consentimento." });
  }
});


router.get("/consentimento/status/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "ID de usuário inválido." });
  }

  try {
    const consentAtual = await Consentimento.findOne({
      userId,
      isCurrent: true,
    });

    if (!consentAtual) {
      const ultimoRevogado = await Consentimento.findOne({
        userId,
        "consentimento.isCurrent": false,
        revogadoEm: { $exists: true },
      }).sort({ revogadoEm: -1 });

      if (ultimoRevogado) {
        return res.json({ status: "revogado", revogadoEm: ultimoRevogado.revogadoEm });
      }

      return res.json({ status: "nao_encontrado" });
    }

    return res.json({ status: "ativo", consentimento: consentAtual.consentimento });
  } catch (err) {
    console.error("Erro ao verificar status do consentimento:", err);
    res.status(500).json({ error: "Erro ao verificar status do consentimento" });
  }
});

module.exports = router;
