import { z } from 'zod'

export const consultaClientesSchema = z.object({

    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    idConsulta: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataHoraConsulta: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    cpfCnpj: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    nomeRazaoSocial: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    constaOcorrencias: z.boolean({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    resultadoConsulta: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    score: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    resultadoCompletoConsulta: z.string().nullable().optional(),

    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

})

export type consultaClientesType = z.infer<typeof consultaClientesSchema>