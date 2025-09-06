"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_model_1 = require("./usuario.model");
const viagem_model_1 = require("./viagem.model");
// Um usuário tem muitas viagens
usuario_model_1.UsuarioModel.hasMany(viagem_model_1.ViagemModel, {
    foreignKey: 'idUsuario',
    as: 'viagens'
});
// Uma viagem pertence a um usuário
viagem_model_1.ViagemModel.belongsTo(usuario_model_1.UsuarioModel, {
    foreignKey: 'idUsuario',
    as: 'usuario'
});
