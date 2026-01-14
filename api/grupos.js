const pool = require("../lib/db");

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const result = await pool.query(`
        SELECT g.id, g.nome, g.galpao_id, gal.nome AS galpao_nome
        FROM grupos g
        JOIN galpoes gal ON gal.id = g.galpao_id
        ORDER BY g.nome
      `);

      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      const { galpao_id, nome } = req.body;

      if (!galpao_id || !nome) {
        return res.status(400).json({
          error: "galpao_id e nome são obrigatórios"
        });
      }

      const result = await pool.query(
        "INSERT INTO grupos (galpao_id, nome) VALUES ($1, $2) RETURNING *",
        [galpao_id, nome]
      );

      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error("ERRO GRUPOS:", err);
    return res.status(500).json({
      error: "Erro interno no servidor",
      detalhe: err.message
    });
  }
};
