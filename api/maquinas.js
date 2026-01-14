const pool = require("../lib/db");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { galpao_id, grupo_id, nome } = req.body;

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

  res.status(405).json({ error: "Método não permitido" });
}
