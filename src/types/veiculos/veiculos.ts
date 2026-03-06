import { z } from 'zod'

export const veiculosSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    marcaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    modeloId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).nonnegative({ message: "Campo Obrigatório" }),
    placa: z.string().trim().min(7, { message: "Campo Obrigatório" }),
    anoFabricacao: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    kmAtual: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    kmRecorrenciaManutencaoPreventiva: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    kmProximaManutencaoPreventiva: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    diasRecorrenciaManutencaoPreventiva: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataProximaManutencaoPreventiva: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    situacaoManutencao: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    disponivel: z.string().min(1, { message: "Campo Obrigatório" }),

    status: z.string().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
})

export type veiculosType = z.infer<typeof veiculosSchema>