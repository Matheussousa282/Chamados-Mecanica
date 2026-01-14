import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { galpao_id, nome } = req.body;

    const result = await pool.query(
      `
      UPDATE grupos
      SET galpao_id = $1, nome = $2
      WHERE id = $3
      RETURNING *
      `,
      [galpao_id, nome, id]
    );

    return res.status(200).json(result.rows[0]);
  }

  res.status(405).json({ error: "Método não permitido" });
}
