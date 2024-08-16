import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        const existingUserEmail = await UserModel.findOne({
            email
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserEmail) {
            if (existingUserEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists with this email',
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserEmail.password = hashedPassword;
                existingUserEmail.verifyCode = verifyCode;
                existingUserEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserEmail.save();
            }
        } else {

            const encryptedPass = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)


            const newUser = new UserModel({
                username, email, password: encryptedPass, verifyCode, verifyCodeExpiry: expiryDate, isVerified: false, isAcceptingMessage: true, messages: []
            })

            await newUser.save();
        }

        //send Verification Email

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User register verify email"
        }, { status: 200 })

    } catch (error) {
        console.error("Error registering user")
        return Response.json({
            success: false,
            message: "Error registering USer"
        }, {
            status: 500
        })
    }
} 