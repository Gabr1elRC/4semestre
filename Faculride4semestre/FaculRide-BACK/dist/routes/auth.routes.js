"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const usuario_model_1 = require("../models/usuario.model");
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }
    try {
        const usuario = await usuario_model_1.UsuarioModel.findOne({
            where: { email, senha },
        });
        if (!usuario) {
            return res.status(401).json({ message: "E-mail ou senha inválidos" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: usuario.idUsuario,
            nome: usuario.nome,
            tipoUsuario: usuario.tipoUsuario,
        }, process.env.JWT_SECRET || "", { expiresIn: "1d" });
        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.idUsuario,
                nome: usuario.nome,
                email: usuario.email,
                tipoUsuario: usuario.tipoUsuario,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || "Erro ao realizar login",
        });
    }
});
exports.default = router;
