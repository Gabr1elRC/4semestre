"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Importação do Swagger
const swagger_1 = require("./swagger/swagger");
// Importação das rotas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const veiculo_routes_1 = __importDefault(require("./routes/veiculo.routes"));
const avaliacao_routes_1 = __importDefault(require("./routes/avaliacao.routes"));
const viagem_routes_1 = __importDefault(require("./routes/viagem.routes"));
const logAcesso_routes_1 = __importDefault(require("./routes/logAcesso.routes"));
// Importa models e associações
require("./models/usuario.model");
require("./models/viagem.model");
require("./models/associations");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Configuração do Swagger
(0, swagger_1.setupSwagger)(app);
// Rotas públicas
app.use("/api/auth", auth_routes_1.default);
// Rotas protegidas
app.use("/api/usuario", usuario_routes_1.default);
app.use("/api/veiculo", veiculo_routes_1.default);
app.use("/api/avaliacao", avaliacao_routes_1.default);
app.use("/api/viagem", viagem_routes_1.default);
app.use("/api/logacesso", logAcesso_routes_1.default);
// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
