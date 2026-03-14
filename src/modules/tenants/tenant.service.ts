import mongoose from "mongoose";
import { User } from "../users/user.model";
import { Tenant } from "./tenant.model";
import { RegisterTenamtInput } from "./tenant.schema";
import { hashPassword } from "../../utils";
import { AppError } from "../../utils/AppError";

export class TenantSerive {
    static async createTanentAndAdmin(data : RegisterTenamtInput) {
        const existingTenant = await Tenant.findOne({slug: data.orgSlug})
        if(existingTenant) 
            throw new AppError(409, "An Organization with thiss slug already exists.")

        const existingUser = await User.findOne({email: data.adminEmail})
        if(existingUser)
            throw new AppError(409, "An admin account with this email already exists.")

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newTenantArray = await Tenant.create([{
                name:data.OrgName,
                slug: data.orgSlug,
                email:data.adminEmail
            }], {session})

            const newTenant = newTenantArray[0]

            const newUserArray = await User.create([{
                tenant : newTenant._id,
                tenant_id: newTenant.tenant_id,
                user_name: data.adminName,
                email: data.adminEmail,
                password: await hashPassword(data.adminPassword),
                role: "ADMIN",
                address: data.adminAddress,
                contact_no: data.adminContactNo
            }], {session})

            await session.commitTransaction();
            session.endSession();

            return {tenantId: newTenant.tenant_id, userId: newUserArray[0].user_id}
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        
    }
}