import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM galpoes ORDER BY nome"
      );
      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      const result = await pool.query(
        "INSERT INTO galpoes (nome, descricao) VALUES ($1, $2) RETURNING *",
        [nome, descricao]
      );

      return res.status(201).json(result.rows[0]);
    }

    return res.status(405).json({ error: "Método não permitido" });

  } catch (error) {
    console.error("ERRO API GALPÕES:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
