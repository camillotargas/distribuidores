import { nullable, z } from 'zod';

export const claimsSchema = z.object({
    clienteSistemaId: z.string(),
    usuarioSistemaId: z.string(),
    usuarioSistemaNome: z.string(),
    clienteSistemaNome: z.string(),
    administradorSistema: z.string(),
    superUsuario: z.string(),
    dataHoraUltimoAcesso: z.string(),
})

export type claimsType = z.infer<typeof claimsSchema>