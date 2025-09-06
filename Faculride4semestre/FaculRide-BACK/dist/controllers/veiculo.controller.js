"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarVeiculo = exports.atualizarVeiculo = exports.criarVeiculo = exports.listarPorUsuario = exports.listarTodos = void 0;
const veiculo_model_1 = require("../models/veiculo.model");
// Listar todos os veículos
const listarTodos = async (req, res) => {
    try {
        const veiculos = await veiculo_model_1.VeiculoModel.findAll();
        return res.status(200).json(veiculos);
    }
    catch (error) {
        return res.status(500).json({ erro: error.message || "Erro ao buscar veículos" });
    }
};
exports.listarTodos = listarTodos;
// Listar veículo por usuário
const listarPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const veiculo = await veiculo_model_1.VeiculoModel.findOne({ where: { idUsuario: Number(idUsuario) } });
        if (!veiculo) {
            return res.status(404).json({ erro: "Nenhum veículo cadastrado para este usuário" });
        }
        return res.status(200).json(veiculo);
    }
    catch (error) {
        return res.status(500).json({ erro: error.message || "Erro ao buscar veículo" });
    }
};
exports.listarPorUsuario = listarPorUsuario;
// Criar veículo
const criarVeiculo = async (req, res) => {
    const dados = req.body;
    try {
        if (!dados.idUsuario) {
            return res.status(400).json({ erro: "idUsuario é obrigatório para criar veículo" });
        }
        const novoVeiculo = await veiculo_model_1.VeiculoModel.create({
            Placa_veiculo: dados.Placa_veiculo,
            Cor: dados.Cor,
            Modelo: dados.Modelo,
            Ano: dados.Ano ? Number(dados.Ano) : null,
            idUsuario: dados.idUsuario
        });
        return res.status(201).json(novoVeiculo);
    }
    catch (error) {
        return res.status(400).json({ erro: error.message || "Erro ao criar veículo" });
    }
};
exports.criarVeiculo = criarVeiculo;
// Atualizar veículo
const atualizarVeiculo = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    try {
        const veiculo = await veiculo_model_1.VeiculoModel.findByPk(Number(id));
        if (!veiculo) {
            return res.status(404).json({ erro: "Veículo não encontrado com este ID" });
        }
        await veiculo.update({
            Placa_veiculo: dados.Placa_veiculo,
            Cor: dados.Cor,
            Modelo: dados.Modelo,
            Ano: dados.Ano ? Number(dados.Ano) : null,
            idUsuario: dados.idUsuario
        });
        return res.status(200).json({ mensagem: "Veículo atualizado com sucesso", veiculo });
    }
    catch (error) {
        return res.status(500).json({ erro: error.message || "Erro ao atualizar veículo" });
    }
};
exports.atualizarVeiculo = atualizarVeiculo;
// Deletar veículo
const deletarVeiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const veiculo = await veiculo_model_1.VeiculoModel.findByPk(Number(id));
        if (!veiculo) {
            return res.status(404).json({ erro: "Veículo não encontrado para este ID" });
        }
        await veiculo.destroy();
        return res.status(200).json({ mensagem: "Veículo deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({ erro: error.message || "Erro ao deletar veículo" });
    }
};
exports.deletarVeiculo = deletarVeiculo;
