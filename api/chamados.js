import { pool } from "./db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { galpao, grupo, equipamento, descricao, supervisor } = req.body;

  const result = await pool.query(
    `INSERT INTO chamados 
     (galpao, grupo, equipamento, descricao, supervisor_nome)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [galpao, grupo, equipamento, descricao, supervisor]
  );

  res.status(201).json(result.rows[0]);
}
