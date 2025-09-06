"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class UsuarioModel extends sequelize_1.Model {
}
exports.UsuarioModel = UsuarioModel;
UsuarioModel.init({
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: false
    },
    ra: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    dataNascimento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    genero: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    cep: {
        type: sequelize_1.DataTypes.STRING(9),
        allowNull: false
    },
    endereco: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    numero: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    cidade: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    estado: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    senha: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    tipoUsuario: {
        type: sequelize_1.DataTypes.ENUM("passageiro", "motorista"),
        allowNull: false
    },
    cnh: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    fatec: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    tableName: "usuario",
    timestamps: false
});
