import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";
import { url } from "inspector";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:"feedback@resend.divyamdembla.com",
            to:email,
            subject:"REAL FEEDBACK - Verification Code",
            react: VerificationEmail({username,otp:verifyCode})

        })


        return {
            success:true,
            message:"Verification email send"
        }
        
    } catch (error) {
        console.log(error);
        console.log("Error sending email")
        return {
            success:false,
            message:"Failed to send verification email"
        }
    }
}