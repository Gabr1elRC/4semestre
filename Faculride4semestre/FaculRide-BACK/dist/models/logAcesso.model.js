"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogAcessoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class LogAcessoModel extends sequelize_1.Model {
}
exports.LogAcessoModel = LogAcessoModel;
LogAcessoModel.init({
    idLogAcesso: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "idLogAcesso"
    },
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "usuario",
            key: "idUsuario"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        field: "idUsuario"
    },
    dataAcesso: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "dataAcesso"
    },
    tipoUsuario: {
        type: sequelize_1.DataTypes.ENUM("passageiro", "motorista"),
        allowNull: false,
        field: "tipoUsuario"
    }
}, {
    sequelize: database_1.default,
    tableName: "logAcesso",
    timestamps: false
});
