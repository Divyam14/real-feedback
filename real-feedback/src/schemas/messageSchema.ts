import {z} from 'zod'

export const verifySchema = z.object({
    content: z.string().min(6,"Message must be atleast of 10 chars").max(200,"Message must be atleast of 10 chars")
})