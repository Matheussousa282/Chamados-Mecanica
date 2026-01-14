import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const result = await pool.query(`
      SELECT *
      FROM chamados_producao
      ORDER BY criado_em DESC
      LIMIT 50
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar chamados" });
  }
}
