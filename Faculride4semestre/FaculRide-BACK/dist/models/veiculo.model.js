"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeiculoModel = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class VeiculoModel extends sequelize_1.Model {
}
exports.VeiculoModel = VeiculoModel;
VeiculoModel.init({
    ID_veiculo: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: "ID_veiculo"
    },
    Placa_veiculo: {
        type: sequelize_1.DataTypes.STRING(8),
        allowNull: true,
        field: "Placa_veiculo"
    },
    Cor: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
        field: "Cor"
    },
    Modelo: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
        field: "Modelo"
    },
    Ano: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: "Ano"
    },
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "idUsuario"
    }
}, {
    sequelize: database_1.default,
    tableName: "veiculo",
    timestamps: false
});
