"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvaliacaoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class AvaliacaoModel extends sequelize_1.Model {
}
exports.AvaliacaoModel = AvaliacaoModel;
AvaliacaoModel.init({
    ID_Avaliacao: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "ID_Avaliacao"
    },
    ID_Avaliador: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "ID_Avaliador",
        references: {
            model: 'usuario',
            key: 'idUsuario'
        }
    },
    ID_Avaliado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "ID_Avaliado",
        references: {
            model: 'usuario',
            key: 'idUsuario'
        }
    },
    Comentario: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: "Comentario"
    },
    Estrelas: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "Estrelas"
    }
}, {
    sequelize: database_1.default,
    tableName: "Avaliacao",
    timestamps: false
});
