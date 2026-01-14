import pool from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { nome, descricao } = req.body;

    const result = await pool.query(
      "UPDATE galpoes SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
      [nome, descricao, id]
    );

    return res.status(200).json(result.rows[0]);
  }

  res.status(405).json({ error: "Método não permitido" });
}
