import { z } from 'zod'

export const modelosSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    marcaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    flagInsertUpdate: z.boolean({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).default(false),
});

export type modelosType = z.infer<typeof modelosSchema>

export const marcasSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    // tsiModuloOpcao: z.array(opcoesSchema).nonempty({ message: "Obrigatório pelo menos um registro" }),
    modelos: z.array(modelosSchema).optional(),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
});

export type marcasType = z.infer<typeof marcasSchema>