import { z } from 'zod'

export const opcoesSchema = z.object({
    // id: z.number().optional(),
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    moduloId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    recurso: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    tipo: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    flagInsertUpdate: z.boolean({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).default(false),
});

export type opcoesType = z.infer<typeof opcoesSchema>

export const modulosSchema = z.object({
    // id: z.number().optional(),
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    realizaVendas: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    temAtendentes: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    // tsiModuloOpcao: z.array(opcoesSchema).nonempty({ message: "Obrigatório pelo menos um registro" }),
    opcoes: z.array(opcoesSchema).optional(),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
});

export type modulosType = z.infer<typeof modulosSchema>