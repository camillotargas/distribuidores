import { z } from 'zod'

export const empresasSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    razaoSocial: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    nomeFantasia: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    inscricaoEstadual: z.string().trim().nullable(),
    cnpj: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    cep: z.string().trim(),
    endereco: z.string().trim(),
    numero: z.string().trim(),
    complemento: z.string().trim(),
    bairro: z.string().trim(),
    cidadeId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    telefone: z.string().trim(),
    email: z.string().trim(),
    site: z.string().trim(),
    dataCadastro: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
});

export type empresasType = z.infer<typeof empresasSchema>