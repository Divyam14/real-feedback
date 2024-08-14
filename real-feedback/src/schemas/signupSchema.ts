import { z } from "zod"

export const usernameValidation = z.string()
    .min(3, "Username must be greater than 3 chars")
    .max(20, "Username must be less than 20 chars")
    .regex(/^[a-zA-Z0-9_]+$/, "Username should not have special chars")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email"}),
    password: z.string().min(6,{message: "Password must be atleast 6 char"})
})