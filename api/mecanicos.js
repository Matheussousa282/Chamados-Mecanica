import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {

    // =====================
    // CRIAR MECÂNICO
    // =====================
    if (req.method === "POST") {
      const {
        nome,
        matricula,
        telefone,
        especialidade,
        turno,
        status
      } = req.body;

      if (!nome || !matricula || !especialidade || !turno) {
        return res.status(400).json({
          error: "Campos obrigatórios ausentes"
        });
      }

      const query = `
        INSERT INTO mecanicos
        (nome, matricula, telefone, especialidade, turno, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [
        nome,
        matricula,
        telefone || null,
        especialidade,
        turno,
        status || "Ativo"
      ];

      const { rows } = await pool.query(query, values);

      return res.status(201).json(rows[0]);
    }

    // =====================
    // LISTAR MECÂNICOS
    // =====================
    if (req.method === "GET") {
      const { status } = req.query;

      let query = `SELECT * FROM mecanicos`;
      let values = [];

      if (status) {
        query += ` WHERE status = $1`;
        values.push(status);
      }

      query += ` ORDER BY nome ASC`;

      const { rows } = await pool.query(query, values);

      return res.status(200).json(rows);
    }

    return res.status(405).json({ error: "Método não permitido" });

  } catch (error) {
    console.error("Erro API Mecânicos:", error);

    // ERRO DE MATRÍCULA DUPLICADA
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Matrícula já cadastrada"
      });
    }

    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}
