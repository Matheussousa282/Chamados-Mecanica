const pool = require("../lib/db");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { supervisor, galpao, grupo, maquina, descricao } = req.body;

  if (!supervisor || !galpao || !grupo || !maquina || !descricao) {
    return res.status(400).json({ error: "Campos obrigatórios" });
  }

  try {
    const query = `
      INSERT INTO chamados_producao
      (supervisor, galpao, grupo, maquina, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [supervisor, galpao, grupo, maquina, descricao];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      chamado: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao salvar chamado" });
  }
}
