import { z } from 'zod'

export const saidasRetornosVeiculosSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    empresaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    solicitanteId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataHoraSolicitacao: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Data Inválida" }),
    veiculoId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    dataHoraPrevistaSaida: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Data Inválida" }),
    destinoId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    motivoSaida: z.string().min(1, { message: "Campo Obrigatório" }),
    ordemServico: z.string().nullable().optional(),
    dataHoraPrevistaRetorno: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Data Inválida" }),
    autorizadorId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    autorizado: z.string().nullable().optional(),
    dataHoraAutorizacao: z.date().nullable().optional(),
    observacoesAutorizacao: z.string().nullable().optional(),

    porteiroSaidaId: z.number().nullable(),
    dataHoraSaida: z.date().nullable().optional(),
    kmSaida: z.number().nullable().optional(),
    observacoesSaida: z.string().nullable().optional(),

    porteiroRetornoId: z.number().nullable(),
    dataHoraRetorno: z.date().nullable().optional(),
    kmRetorno: z.number().nullable().optional(),
    observacoesRetorno: z.string().nullable().optional(),

    situacao: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
}).superRefine((values, ctx) => {

    if (values.autorizado !== '' && (values.dataHoraAutorizacao == null || values.dataHoraAutorizacao == undefined)) {
        ctx.addIssue({
            path: ['dataHoraAutorizacao'],
            code: z.ZodIssueCode.invalid_date,
            // minimum: 0.01,
            // type: 'number',
            // inclusive: true,
            message: "Campo Obrigatório"
        })
    }

})

export type saidasRetornosVeiculosType = z.infer<typeof saidasRetornosVeiculosSchema>