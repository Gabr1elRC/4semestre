import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Caminho do arquivo do banco SQLite (será criado na pasta do projeto)
const databasePath = path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: false, // desativa logs de SQL
});

export default sequelize;



