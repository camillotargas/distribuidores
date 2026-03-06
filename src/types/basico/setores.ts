import { z } from 'zod'

export const setoresSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
});

export type setoresType = z.infer<typeof setoresSchema>