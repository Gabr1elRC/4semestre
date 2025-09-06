"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuario_controller_1 = require("../controllers/usuario.controller");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express_1.default.Router();
// ROTAS PÚBLICAS — Cadastro e Login
router.post("/", async (req, res) => {
    const usuario = req.body;
    try {
        const resposta = await (0, usuario_controller_1.cadastrarUsuario)(usuario);
        res.status(201).json(resposta);
    }
    catch (error) {
        res.status(400).json({ erro: error.message || "Erro ao cadastrar usuário" });
    }
});
router.post("/login", (req, res) => {
    (0, usuario_controller_1.loginUsuario)(req, res);
});
// A partir daqui todas as rotas são protegidas
router.use(authorize_middleware_1.AuthorizeMiddleware);
// GET Listar ou filtrar usuários 
router.get("/", async (req, res) => {
    const filtros = req.query;
    try {
        const resposta = await (0, usuario_controller_1.filtrarUsuarios)(filtros);
        res.status(200).json(resposta);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
});
// GET Buscar usuário por ID 
router.get("/:id", (req, res) => {
    (0, usuario_controller_1.buscarUsuarioPorId)(req, res);
});
// PUT Atualizar dados do usuário 
router.put("/:id", (req, res) => {
    (0, usuario_controller_1.atualizarUsuario)(req, res);
});
// DELETE usuário 
router.delete("/:id", (req, res) => {
    (0, usuario_controller_1.deletarUsuario)(req, res);
});
exports.default = router;
