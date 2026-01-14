import pool from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const {
    supervisor,
    galpao_id,
    grupo_id,
    maquina_id,
    descricao
  } = req.body;

  if (!supervisor || !galpao_id || !grupo_id || !maquina_id || !descricao) {
    return res.status(400).json({ error: "Dados obrigatórios ausentes" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO chamados
      (supervisor, galpao_id, grupo_id, maquina_id, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [supervisor, galpao_id, grupo_id, maquina_id, descricao]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar chamado" });
  }
}
