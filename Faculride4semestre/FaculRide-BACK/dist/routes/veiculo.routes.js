"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const veiculo_controller_1 = require("../controllers/veiculo.controller");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express_1.default.Router();
// Aplica autenticação JWT para todas as rotas abaixo
router.use(authorize_middleware_1.AuthorizeMiddleware);
// GET veiculos
router.get("/", async (req, res) => {
    await (0, veiculo_controller_1.listarTodos)(req, res);
});
// GET listar veículo por usuário
router.get("/usuario/:idUsuario", async (req, res) => {
    await (0, veiculo_controller_1.listarPorUsuario)(req, res);
});
// POST veiculo
router.post("/", async (req, res) => {
    await (0, veiculo_controller_1.criarVeiculo)(req, res);
});
// PUT veículo
router.put("/:id", async (req, res) => {
    await (0, veiculo_controller_1.atualizarVeiculo)(req, res);
});
// DELETE veículo
router.delete("/:id", async (req, res) => {
    await (0, veiculo_controller_1.deletarVeiculo)(req, res);
});
exports.default = router;
