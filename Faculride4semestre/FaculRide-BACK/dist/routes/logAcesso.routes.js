"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logAcesso_controller_1 = require("../controllers/logAcesso.controller");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express_1.default.Router();
// Aplica autenticação JWT para todas as rotas abaixo
router.use(authorize_middleware_1.AuthorizeMiddleware);
// GET log de acessos
router.get('/', async (req, res) => {
    try {
        const logs = await (0, logAcesso_controller_1.listAll)();
        res.status(200).json(logs);
    }
    catch (error) {
        res.status(500).json({ erro: error.message || "Erro ao buscar log de acesso" });
    }
});
// POST log de acesso
router.post('/', async (req, res) => {
    try {
        const novoLog = await (0, logAcesso_controller_1.create)(req.body);
        res.status(201).json({
            mensagem: "Log de acesso criado com sucesso",
            logAcesso: novoLog
        });
    }
    catch (error) {
        res.status(500).json({ erro: error.message || "Erro ao cadastrar log de acesso" });
    }
});
// PUT log de acesso
router.put('/:id', (req, res) => {
    const { id } = req.params;
    (0, logAcesso_controller_1.update)(Number(id), req.body)
        .then(logAtualizado => {
        if (!logAtualizado) {
            return res.status(404).json({ erro: "Log de acesso não encontrado" });
        }
        res.status(200).json({
            mensagem: "Log de acesso atualizado com sucesso",
            logAcesso: logAtualizado
        });
    })
        .catch(error => {
        res.status(500).json({ erro: error.message || "Erro ao atualizar log de acesso" });
    });
});
// DELETE log de acesso
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    (0, logAcesso_controller_1.remove)(Number(id))
        .then(sucesso => {
        if (!sucesso) {
            return res.status(404).json({ erro: "Log de acesso não encontrado" });
        }
        res.status(200).json({ mensagem: "Log de acesso deletado com sucesso" });
    })
        .catch(error => {
        res.status(500).json({ erro: error.message || "Erro ao deletar log de acesso" });
    });
});
exports.default = router;
