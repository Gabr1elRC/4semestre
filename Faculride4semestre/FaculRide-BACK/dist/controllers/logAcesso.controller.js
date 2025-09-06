"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.listAll = void 0;
const logAcesso_model_1 = require("../models/logAcesso.model");
// GET log de acesso
const listAll = () => {
    return logAcesso_model_1.LogAcessoModel.findAll();
};
exports.listAll = listAll;
// POST log de acesso
const create = (dados) => {
    return logAcesso_model_1.LogAcessoModel.create(dados);
};
exports.create = create;
// PUT log de acesso
const update = (id, dados) => {
    return logAcesso_model_1.LogAcessoModel.findByPk(id).then(log => {
        if (!log)
            return null;
        return log.update(dados);
    });
};
exports.update = update;
// DELETE log de acesso
const remove = (id) => {
    return logAcesso_model_1.LogAcessoModel.findByPk(id).then(log => {
        if (!log)
            return false;
        return log.destroy().then(() => true);
    });
};
exports.remove = remove;
