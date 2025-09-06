"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.listAll = void 0;
const viagem_model_1 = require("../models/viagem.model");
const usuario_model_1 = require("../models/usuario.model");
// GET viagem
const listAll = () => {
    return viagem_model_1.ViagemModel.findAll({
        include: [
            {
                model: usuario_model_1.UsuarioModel,
                as: 'usuario',
                attributes: ['nome', 'email', 'telefone', 'genero']
            }
        ]
    });
};
exports.listAll = listAll;
// POST viagem
const create = (dados) => {
    return viagem_model_1.ViagemModel.create(dados);
};
exports.create = create;
// PUT viagem
const update = (id, dados) => {
    return viagem_model_1.ViagemModel.findByPk(id).then(viagem => {
        if (!viagem)
            return null;
        return viagem.update(dados);
    });
};
exports.update = update;
// DELETE viagem
const remove = (id) => {
    return viagem_model_1.ViagemModel.findByPk(id).then(viagem => {
        if (!viagem)
            return false;
        return viagem.destroy().then(() => true);
    });
};
exports.remove = remove;
