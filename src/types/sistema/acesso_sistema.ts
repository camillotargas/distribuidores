import { nullable, z } from 'zod';

export const loginSchema = z.object({
cliente: z.string().min(1, {message: "Campo Obrigatório"}),
usuario: z.string().min(1, {message: "Campo Obrigatório"}),
senha: z.string().min(1, {message: "Campo Obrigatório"}),
lembrarMe: z.boolean(),
})

export type loginType = z.infer<typeof loginSchema>