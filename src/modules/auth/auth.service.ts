import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { LoginInput } from "./auth.schema";
import { User } from "../users/user.model";
import { AppError } from "../../utils/AppError";

export class AuthService{
    static async userLogin(data: LoginInput){
        let user = await User.findOne({email: data.email})

        if(!user)
            throw new AppError(401, "Invalid Email or Password")

        let isvalidPassword = await bcrypt.compare(data.password, user.password)
        
        if(!isvalidPassword)
            throw new AppError(401, "Invalid Email or password")

        let payload = {
            user_id: user.user_id,
            tenant_id: user.tenant_id,
            role: user.role
        }

        const secret = process.env.JWT_SECRET!
        const token = jwt.sign(payload, secret, {expiresIn: '1d'})

        return{
            token,
            user:{
                tenant_id: user.tenant_id,
                user_id: user.user_id,
                user_name: user.user_name,
                user_role: user.role,
                user_email: user.email,
                user_contact: user.contact_no,
                user_address: user.address
            }
        }
    }
}