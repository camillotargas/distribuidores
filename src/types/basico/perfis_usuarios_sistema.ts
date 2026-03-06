import { z } from 'zod'
import { modulosSchema, opcoesSchema } from '../sistema/modulos_opcoes';

export const direitosSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    perfilUsuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    moduloId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    moduloNome: z.string().nullable().optional(),
    tsiModulo: modulosSchema.nullable().optional(),
    opcaoId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    opcaoNome: z.string().nullable().optional(),
    tsiOpcao: opcoesSchema.nullable().optional(),
    direito: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    // status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    flagInsertUpdate: z.boolean({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).default(false),
    flagDelete: z.boolean({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }).default(false),
})

export type direitosType = z.infer<typeof direitosSchema>

export const perfisSchema = z.object({
    id: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    clienteSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),

    nome: z.string().trim().min(1, { message: "Campo Obrigatório" }),

    // tsiModuloOpcao: z.array(opcoesSchema).nonempty({ message: "Obrigatório pelo menos um registro" }),
    tbaDireitoPerfilUsuarioSistema: z.array(direitosSchema).optional(),

    status: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    usuarioSistemaId: z.number({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
    usuarioSistemaNome: z.string().trim().min(1, { message: "Campo Obrigatório" }),
    dataHora: z.coerce.date({ required_error: "Campo Obrigatório", invalid_type_error: "Campo Obrigatório" }),
})
// .superRefine((items, ctx) => {

//     const mapa = new Set<string>();

//     if (items.tbaDireitoPerfilUsuarioSistema) {

//         items.tbaDireitoPerfilUsuarioSistema.forEach((item: any, index: number) => {

//             const chave = `${item.clienteSistemaId}-${item.moduloId}-${item.opcaoId}`

//             if (mapa.has(chave)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: `Duplicado encontrado: clienteSistemaId ${item.clienteSistemaId}, moduloId ${item.moduloId}`,
//                     path: [index],
//                 });
//             }

//             mapa.add(chave)

//         })

//     }

// })


export type perfisType = z.infer<typeof perfisSchema>