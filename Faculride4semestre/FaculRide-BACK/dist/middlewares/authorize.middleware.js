"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AuthorizeMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const secret = process.env.JWT_SECRET || "";
    if (!authorization) {
        return res.status(401).json({ message: "Token não fornecido." });
    }
    const token = authorization.replace("Bearer ", "").trim();
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido ou expirado." });
        }
        req.usuario = decoded;
        console.log("✔️ Token validado:", decoded);
        next();
    });
};
exports.AuthorizeMiddleware = AuthorizeMiddleware;
