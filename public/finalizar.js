const pool = require("../lib/db");

module.exports = async function handler(req, res) {
  // Só aceita método PUT
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { id, mecanico, solucao } = req.body;

    // Validação básica
    if (!id || !mecanico || !solucao) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    // Atualiza chamado
    const result = await pool.query(
      `
      UPDATE chamados_producao
      SET mecanico = $1,
          solucao = $2,
          status = 'Finalizado',
          finalizado_em = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [mecanico, solucao, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("ERRO API /api/finalizar:", error);
    return res.status(500).json({ error: "Erro interno", detalhe: error.message });
  }
};
