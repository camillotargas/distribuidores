
import { z } from 'zod'

export const cidadesSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    estadoId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    estadoNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    estadoSigla: z.string().trim().min(1, { message: "Campo Obrigatório" }),
})

export type cidadesType = z.infer<typeof cidadesSchema>