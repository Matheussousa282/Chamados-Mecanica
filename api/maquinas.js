const pool = require("../lib/db");

module.exports = async (req, res) => {
  try {
    // LISTAR MÁQUINAS
    if (req.method === "GET") {
      const result = await pool.query(`
        SELECT 
          m.id,
          m.nome,
          m.galpao_id,
          g.nome AS galpao_nome,
          m.grupo_id,
          gr.nome AS grupo_nome
        FROM maquinas m
        JOIN galpoes g ON g.id = m.galpao_id
        JOIN grupos gr ON gr.id = m.grupo_id
        ORDER BY m.nome
      `);

      return res.status(200).json(result.rows);
    }

    // CADASTRAR MÁQUINA
    if (req.method === "POST") {
      const { galpao_id, grupo_id, nome } = req.body;

      if (!galpao_id || !grupo_id || !nome) {
        return res.status(400).json({
          error: "galpao_id, grupo_id e nome são obrigatórios"
        });
      }

      const result = await pool.query(
        `
        INSERT INTO maquinas (galpao_id, grupo_id, nome)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [galpao_id, grupo_id, nome]
      );

      return res.status(201).json(result.rows[0]);
    }

    // ATUALIZAR MÁQUINA
    if (req.method === "PUT") {
      const { id } = req.query;
      const { galpao_id, grupo_id, nome } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      const result = await pool.query(
        `
        UPDATE maquinas
        SET galpao_id = $1, grupo_id = $2, nome = $3
        WHERE id = $4
        RETURNING *
        `,
        [galpao_id, grupo_id, nome, id]
      );

      return res.status(200).json(result.rows[0]);
    }

    // EXCLUIR MÁQUINA
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
      }

      await pool.query(
        "DELETE FROM maquinas WHERE id = $1",
        [id]
      );

      return res.status(204).end();
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error("ERRO MÁQUINAS:", err);
    return res.status(500).json({
      error: "Erro interno no servidor",
      detalhe: err.message
    });
  }
};
