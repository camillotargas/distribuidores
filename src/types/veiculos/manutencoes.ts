import { z } from 'zod'

export const manutencoesSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    veiculoId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataInicio: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataFim: z.date().nullable().optional(),
    tipo: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    km: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    memorando: z.string().trim(),
    situacao: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    status: z.string().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
})

export type manutencoesType = z.infer<typeof manutencoesSchema>