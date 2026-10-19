import { Pool } from "pg";

const pool = new Pool({
  // A conexão centralizada permite que os controllers usem consultas parametrizadas.
  host: "localhost",
  user: "admin",
  password: "senha123",
  database: "aula_db",
  port: 5432,
});

export default pool;
