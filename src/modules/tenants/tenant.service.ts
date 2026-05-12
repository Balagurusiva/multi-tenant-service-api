import mongoose from "mongoose";
import { User } from "../users/user.model";
import { Tenant } from "./tenant.model";
import { GetTenantInput, GetTenantListInput, RegisterTenantInput } from "./tenant.schema";
import { hashPassword } from "../../utils";
import { AppError } from "../../utils/AppError";
import { paginate } from "../../utils/Pagination";

export class TenantService {
    static async createTenantAndAdmin(data: RegisterTenantInput) {
        const existingTenant = await Tenant.findOne({ slug: data.orgSlug })
        if (existingTenant)
            throw new AppError(409, "An Organization with thiss slug already exists.")

        const existingUser = await User.findOne({ email: data.adminEmail })
        if (existingUser)
            throw new AppError(409, "An admin account with this email already exists.")

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newTenantArray = await Tenant.create([{
                name: data.OrgName,
                slug: data.orgSlug,
                email: data.adminEmail
            }], { session })

            const newTenant = newTenantArray[0]

            const newUserArray = await User.create([{
                tenant: newTenant._id,
                tenant_id: newTenant.tenant_id,
                user_name: data.adminName,
                email: data.adminEmail,
                password: await hashPassword(data.adminPassword),
                role: "ADMIN",
                address: data.adminAddress,
                contact_no: data.adminContactNo
            }], { session })

            await session.commitTransaction();
            session.endSession();

            return { tenantId: newTenant.tenant_id, userId: newUserArray[0].user_id }
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    }

    static async getTenantList(data: GetTenantListInput) {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'name',
            orderBy = 'asc'
        } = data

        let filter: Record<string, any> = {}
        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } }
            ]
        }

        return await paginate({
            model: Tenant,
            filter,
            select: "tenant_id name slug email status -_id",
            page,
            limit,
            sortBy,
            orderBy,
            allowedSortFeilds: ["name", "slug", "status"],
            defaultSortBy: "name",
        });

    }

    static async getTenant(data: GetTenantInput) {
        let orgSlug = data.slug
        let tenant = await Tenant.find({ slug: orgSlug }, 'name slug email status -_id').lean();
        return tenant
    }

    static async getTenantIdBySlug(slug: string) {
        const tenant = await Tenant.findOne({ slug }, 'tenant_id').lean();

        if (!tenant)
            throw new AppError(404, "Tenant not found")

        return tenant.tenant_id
    }

}
