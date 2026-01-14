const pool = require("../lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const {
      supervisor,
      galpao,
      grupo,
      maquina,
      descricao
    } = req.body;

    if (!supervisor || !galpao || !grupo || !maquina || !descricao) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const result = await pool.query(
      `
      INSERT INTO chamados_producao
      (supervisor, galpao, grupo, maquina, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [supervisor, galpao, grupo, maquina, descricao]
    );

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("ERRO API /api/chamados:", error);
    return res.status(500).json({
      error: "Erro interno",
      detalhe: error.message
    });
  }
};
