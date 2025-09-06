"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarUsuario = exports.atualizarUsuario = exports.buscarUsuarioPorId = exports.loginUsuario = exports.filtrarUsuarios = exports.cadastrarUsuario = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const usuario_model_1 = require("../models/usuario.model");
const veiculo_model_1 = require("../models/veiculo.model");
const logAcesso_model_1 = require("../models/logAcesso.model");
// Validação de senha forte
function validarSenha(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!regex.test(senha)) {
        throw new Error("A senha deve conter no mínimo: 6 caracteres, 1 letra minúscula, 1 letra maiúscula, 1 número e 1 caractere especial (@$!%*#?&)");
    }
}
// Cadastro de usuário
const cadastrarUsuario = async (usuario) => {
    const tiposPermitidos = ["passageiro", "motorista"];
    if (!tiposPermitidos.includes(usuario.tipoUsuario)) {
        throw new Error("Tipo de usuário inválido");
    }
    if (usuario.tipoUsuario === "motorista" && !usuario.cnh) {
        throw new Error("Motoristas precisam informar o número da CNH");
    }
    if (!usuario.dataNascimento) {
        throw new Error("Data de nascimento é obrigatória");
    }
    const dataNascimento = new Date(usuario.dataNascimento);
    const hoje = new Date();
    if (isNaN(dataNascimento.getTime()) || dataNascimento > hoje) {
        throw new Error("Data de nascimento inválida");
    }
    // Normalize email
    usuario.email = usuario.email.trim().toLowerCase();
    // Valida e criptografa senha
    validarSenha(usuario.senha);
    const senhaCriptografada = await bcryptjs_1.default.hash(usuario.senha, 10);
    usuario.senha = senhaCriptografada;
    const novoUsuario = await usuario_model_1.UsuarioModel.create(usuario);
    // Cria veículo se for motorista
    const veiculo = usuario.veiculo;
    if (usuario.tipoUsuario === "motorista" && veiculo) {
        await veiculo_model_1.VeiculoModel.create({
            ...veiculo,
            idUsuario: novoUsuario.idUsuario,
        });
    }
    return { id: novoUsuario.idUsuario };
};
exports.cadastrarUsuario = cadastrarUsuario;
// Filtrar usuários
const filtrarUsuarios = async (filtros) => {
    const usuarios = await usuario_model_1.UsuarioModel.findAll({
        where: {
            ...(filtros.nome && { nome: filtros.nome }),
            ...(filtros.email && { email: filtros.email }),
            ...(filtros.tipoUsuario && { tipoUsuario: filtros.tipoUsuario }),
        },
    });
    return usuarios;
};
exports.filtrarUsuarios = filtrarUsuarios;
// Login de usuário com Log de Acesso
const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
    }
    try {
        const usuario = await usuario_model_1.UsuarioModel.findOne({
            where: { email: email.trim().toLowerCase() },
        });
        if (!usuario) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos" });
        }
        const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos" });
        }
        const veiculo = await veiculo_model_1.VeiculoModel.findOne({
            where: { idUsuario: usuario.idUsuario },
        });
        const token = jsonwebtoken_1.default.sign({
            id: usuario.idUsuario,
            nome: usuario.nome,
            tipoUsuario: usuario.tipoUsuario,
        }, process.env.JWT_SECRET || "secretoo123", { expiresIn: "1d" });
        // Cria log de acesso automaticamente no login
        await logAcesso_model_1.LogAcessoModel.create({
            idUsuario: usuario.idUsuario,
            dataAcesso: new Date(),
            tipoUsuario: usuario.tipoUsuario,
        });
        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.idUsuario,
                nome: usuario.nome,
                cpf: usuario.cpf,
                email: usuario.email,
                telefone: usuario.telefone,
                cep: usuario.cep,
                endereco: usuario.endereco,
                numero: usuario.numero,
                cidade: usuario.cidade,
                estado: usuario.estado,
                fatec: usuario.fatec,
                ra: usuario.ra,
                genero: usuario.genero,
                dataNascimento: usuario.dataNascimento,
                tipoUsuario: usuario.tipoUsuario,
                veiculo: veiculo ? veiculo.toJSON() : null
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            erro: error.message || "Erro interno ao fazer login",
        });
    }
};
exports.loginUsuario = loginUsuario;
// Buscar usuário por ID
const buscarUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuario_model_1.UsuarioModel.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        const veiculo = await veiculo_model_1.VeiculoModel.findOne({
            where: { idUsuario: usuario.idUsuario },
        });
        return res.status(200).json({
            id: usuario.idUsuario,
            nome: usuario.nome,
            cpf: usuario.cpf,
            email: usuario.email,
            telefone: usuario.telefone,
            cep: usuario.cep,
            endereco: usuario.endereco,
            numero: usuario.numero,
            cidade: usuario.cidade,
            estado: usuario.estado,
            fatec: usuario.fatec,
            ra: usuario.ra,
            genero: usuario.genero,
            dataNascimento: usuario.dataNascimento,
            tipoUsuario: usuario.tipoUsuario,
            veiculo: veiculo ? veiculo.toJSON() : null,
        });
    }
    catch (error) {
        return res.status(500).json({
            erro: error.message || "Erro ao buscar usuário",
        });
    }
};
exports.buscarUsuarioPorId = buscarUsuarioPorId;
// Atualizar dados do usuário
const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    try {
        const usuario = await usuario_model_1.UsuarioModel.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        await usuario.update(dados);
        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({
            erro: error.message || "Erro ao atualizar usuário",
        });
    }
};
exports.atualizarUsuario = atualizarUsuario;
// Deletar usuário e seus veículos
const deletarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuario_model_1.UsuarioModel.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        await veiculo_model_1.VeiculoModel.destroy({ where: { idUsuario: id } });
        await usuario.destroy();
        return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
    }
    catch (error) {
        return res.status(500).json({
            erro: error.message || "Erro ao deletar usuário",
        });
    }
};
exports.deletarUsuario = deletarUsuario;
