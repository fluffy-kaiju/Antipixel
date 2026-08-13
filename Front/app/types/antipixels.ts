import { z } from 'zod'

export const AntipixelSchema = z.object({
    id: z.number().positive(),
    name: z.string(),
    path: z.string(),
    hash: z.string(),
    description: z.string(),
});

export type Antipixel = z.infer<typeof AntipixelSchema>
