
import { z } from 'zod'

export const usuariosSistemaSchema = z.object({

    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    cpf: z.string().trim().min(11, { message: "Campo Obrigatório" }),
    email: z.string().trim(),
    usuario: z.string().trim(),
    senha: z.string().trim(),
    perfilUsuarioSistemaId: z.number().nullable(),
    administradorSistema: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    setorId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).nonnegative({ message: "Campo Obrigatório" }),

    saidasRetornosVeiculosAutorizador: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    saidasRetornosVeiculosPorteiro: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    dataHoraCadastro: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataHoraUltimoAcesso: z.date().nullable().optional(),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
})

export type usuariosSistemaType = z.infer<typeof usuariosSistemaSchema>