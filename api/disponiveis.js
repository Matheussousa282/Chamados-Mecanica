import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const result = await pool.query(`
      SELECT id, nome, matricula, especialidade
      FROM mecanicos
      WHERE status = 'Ativo'
      ORDER BY nome
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar mecânicos disponíveis" });
  }
}
