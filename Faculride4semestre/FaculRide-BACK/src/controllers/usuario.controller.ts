import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import exceljs from "exceljs";
dotenv.config();

import { UsuarioModel } from "../models/usuario.model";
import { VeiculoModel } from "../models/veiculo.model";
import { LogAcessoModel } from "../models/logAcesso.model";
import { Iusuario, IRetornoCadastroUsuario, IusuarioFiltros } from "../interfaces/Iusuario";
import { IVeiculo } from "../interfaces/Iveiculo";
import { ViagemModel } from "../models/viagem.model";

// Validação de senha forte
function validarSenha(senha: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  if (!regex.test(senha)) {
    throw new Error(
      "A senha deve conter no mínimo: 6 caracteres, 1 letra minúscula, 1 letra maiúscula, 1 número e 1 caractere especial (@$!%*#?&)"
    );
  }
}

// Cadastro de usuário
export const cadastrarUsuario = async (usuario: Iusuario): Promise<IRetornoCadastroUsuario> => {
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
  const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
  usuario.senha = senhaCriptografada;

  const novoUsuario = await UsuarioModel.create(usuario);

  // Cria veículo se for motorista
  const veiculo = (usuario as any).veiculo as IVeiculo;
  if (usuario.tipoUsuario === "motorista" && veiculo) {
    await VeiculoModel.create({
      ...veiculo,
      idUsuario: novoUsuario.idUsuario,
    });
  }

  return { id: novoUsuario.idUsuario };
};

// Filtrar usuários
export const filtrarUsuarios = async (filtros: IusuarioFiltros): Promise<Iusuario[]> => {
  const usuarios = await UsuarioModel.findAll({
    where: {
      ...(filtros.nome && { nome: filtros.nome }),
      ...(filtros.email && { email: filtros.email }),
      ...(filtros.tipoUsuario && { tipoUsuario: filtros.tipoUsuario }),
    },
  });
  return usuarios;
};

// Login de usuário com Log de Acesso
export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
  }

  try {
    const usuario = await UsuarioModel.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!usuario) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    const veiculo = await VeiculoModel.findOne({
      where: { idUsuario: usuario.idUsuario },
    });

    const token = jwt.sign(
      {
        id: usuario.idUsuario,
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario,
      },
      process.env.JWT_SECRET || "secretoo123",
      { expiresIn: "1d" }
    );

    // Cria log de acesso automaticamente no login
    await LogAcessoModel.create({
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
  } catch (error: any) {
    return res.status(500).json({
      erro: error.message || "Erro interno ao fazer login",
    });
  }
};

// Buscar usuário por ID
export const buscarUsuarioPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await UsuarioModel.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const veiculo = await VeiculoModel.findOne({
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
  } catch (error: any) {
    return res.status(500).json({
      erro: error.message || "Erro ao buscar usuário",
    });
  }
};

// Atualizar dados do usuário
export const atualizarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const dados = req.body as Iusuario;

  try {
    const usuario = await UsuarioModel.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await usuario.update(dados);

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error: any) {
    return res.status(500).json({
      erro: error.message || "Erro ao atualizar usuário",
    });
  }
};

// Deletar usuário e seus veículos
export const deletarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await UsuarioModel.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await VeiculoModel.destroy({ where: { idUsuario: id } });
    await usuario.destroy();

    return res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error: any) {
    return res.status(500).json({
      erro: error.message || "Erro ao deletar usuário",
    });
  }
};

export const exportarUsuariosExcel = async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioModel.findAll({
      include: [ViagemModel] // só se tiver associação
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      {header:"ID", key:"id", width:10},
      {header:"Nome", key:"nome", width:30},
      {header:"EMAIL", key:"email", width:30},
      {header:"TIPO", key:"tipo", width:15},
      {header:"idViagem", key:"idViagem", width:10},
      {header:"tipoUsuario", key:"tipoUsuario", width:15},
      {header:"partida", key:"partida", width:20},
      {header:"destino", key:"destino", width:20},
      {header:"ajudaDeCusto", key:"ajudaDeCusto", width:15},
      {header:"Criado em", key:"createdAt", width:20}
    ];

    usuarios.forEach((u: any) => {
      worksheet.addRow({
        id: u.id,
        nome: u.nome,
        email: u.email,
        tipo: u.tipo,
        idViagem: u.Viagem?.id ?? "",
        tipoUsuario: u.tipoUsuario,
        partida: u.Viagem?.partida ?? "",
        destino: u.Viagem?.destino ?? "",
        ajudaDeCusto: u.Viagem?.ajudaDeCusto ?? "",
        createdAt: u.createdAt ? u.createdAt.toISOString().split("T")[0] : ""
      });
    });

    res.setHeader(
      "content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=usuarios.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error: any) {
    res.status(500).json({
      erro: "Erro ao exportar usuarios para Excel",
      detalhe: error.message
    });
  }
};

