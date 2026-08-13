import { z } from 'zod'

export const UserSchema = z.object({
    id: z.number().positive(),
    userName: z.string(),
})

export type User = z.infer<typeof UserSchema>
