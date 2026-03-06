
import { z } from 'zod'

export const comboBoxSchema = z.object({
    id: z.number(),
    nome: z.string(),
    status: z.string(),
});

export type comboBoxType = z.infer<typeof comboBoxSchema>