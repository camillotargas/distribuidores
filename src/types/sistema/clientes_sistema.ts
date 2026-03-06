
import { z } from 'zod'

export const clientesSistemaSchema = z.object({

    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    // id: z.number().optional(),
    razaoSocial: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    nomeFantasia: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    inscricaoEstadual: z.string().trim().nullable(),
    cnpj: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    cep: z.string().trim().nullable(),
    endereco: z.string().trim().nullable(),
    numero: z.string().trim().nullable(),
    complemento: z.string().trim().nullable(),
    bairro: z.string().trim().nullable(),
    cidadeId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    telefone: z.string().trim().nullable(),
    email: z.string().trim().nullable(),
    site: z.string().trim().nullable(),
    valorMensal: z.coerce.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataPrimeiraMensalidade: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    diaCobranca: z.coerce.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataFimLicenca: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataCadastro: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

})

export type clientesSistemaType = z.infer<typeof clientesSistemaSchema>