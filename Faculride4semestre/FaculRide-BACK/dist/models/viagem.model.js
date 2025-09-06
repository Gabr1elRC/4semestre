"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViagemModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ViagemModel extends sequelize_1.Model {
}
exports.ViagemModel = ViagemModel;
ViagemModel.init({
    idViagem: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    tipoUsuario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    partida: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destino: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    horarioEntrada: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    horarioSaida: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ajudaDeCusto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'idUsuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    sequelize: database_1.default,
    tableName: "viagem",
    timestamps: false,
});
