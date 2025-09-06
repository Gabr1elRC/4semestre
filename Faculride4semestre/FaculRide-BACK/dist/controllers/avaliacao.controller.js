"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.listAll = void 0;
const avaliacao_model_1 = require("../models/avaliacao.model");
// Listar todas as avaliações
const listAll = async () => {
    return await avaliacao_model_1.AvaliacaoModel.findAll();
};
exports.listAll = listAll;
// Criar nova avaliação
const create = async (dados) => {
    if (!dados.Comentario || dados.Comentario.trim().length < 3) {
        throw new Error("O comentário deve conter pelo menos 3 caracteres.");
    }
    if (dados.Estrelas === undefined || dados.Estrelas < 1 || dados.Estrelas > 5) {
        throw new Error("As estrelas devem ser um número entre 1 e 5.");
    }
    const nova = await avaliacao_model_1.AvaliacaoModel.create(dados);
    return nova;
};
exports.create = create;
// Atualizar avaliação
const update = async (id, dados) => {
    const avaliacao = await avaliacao_model_1.AvaliacaoModel.findByPk(id);
    if (!avaliacao)
        return null;
    if (dados.Comentario && dados.Comentario.trim().length < 3) {
        throw new Error("O comentário deve conter pelo menos 3 caracteres.");
    }
    if (dados.Estrelas !== undefined && (dados.Estrelas < 1 || dados.Estrelas > 5)) {
        throw new Error("As estrelas devem ser um número entre 1 e 5.");
    }
    await avaliacao.update(dados);
    return avaliacao;
};
exports.update = update;
// Remover avaliação
const remove = async (id) => {
    const avaliacao = await avaliacao_model_1.AvaliacaoModel.findByPk(id);
    if (!avaliacao)
        return false;
    await avaliacao.destroy();
    return true;
};
exports.remove = remove;
