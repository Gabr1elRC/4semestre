"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const viagem_controller_1 = require("../controllers/viagem.controller");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = express_1.default.Router();
// Aplica autenticação JWT para todas as rotas abaixo
router.use(authorize_middleware_1.AuthorizeMiddleware);
// GET viagem
router.get("/", (req, res) => {
    (0, viagem_controller_1.listAll)()
        .then(viagens => res.status(200).json(viagens))
        .catch(error => res.status(500).json({ erro: error.message || "Erro ao buscar viagens" }));
});
// POST viagem
router.post("/", (req, res) => {
    (0, viagem_controller_1.create)(req.body)
        .then(novaViagem => res.status(201).json({
        mensagem: "Viagem cadastrada com sucesso",
        viagem: novaViagem
    }))
        .catch(error => res.status(500).json({ erro: error.message || "Erro ao cadastrar viagem" }));
});
// PUT viagem
router.put("/:id", (req, res) => {
    const { id } = req.params;
    (0, viagem_controller_1.update)(Number(id), req.body)
        .then(viagemAtualizada => {
        if (!viagemAtualizada) {
            return res.status(404).json({ erro: "Viagem não encontrada" });
        }
        res.status(200).json({
            mensagem: "Viagem atualizada com sucesso",
            viagem: viagemAtualizada
        });
    })
        .catch(error => res.status(500).json({ erro: error.message || "Erro ao atualizar viagem" }));
});
// DELETE viagem
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    (0, viagem_controller_1.remove)(Number(id))
        .then(sucesso => {
        if (!sucesso) {
            return res.status(404).json({ erro: "Viagem não encontrada" });
        }
        res.status(200).json({ mensagem: "Viagem deletada com sucesso" });
    })
        .catch(error => res.status(500).json({ erro: error.message || "Erro ao deletar viagem" }));
});
exports.default = router;
