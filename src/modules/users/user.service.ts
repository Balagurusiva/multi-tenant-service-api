import { CurrUser, Role } from "../../types/global";
import { hashPassword } from "../../utils";
import { AppError } from "../../utils/AppError";
import { Tenant } from "../tenants/tenant.model";
import { User } from "./user.model";
import { CreateTechnicianInput, GetTechnicianInput, GetUserListInput, UpdateTechnicianInput } from "./user.schema";

export class UserSerive {
    private static formatUser(user: any) {
        return {
            user_id: user.user_id,
            name: user.user_name,
            role: user.role,
            email: user.email,
            address: user.address,
            contact_no: user.contact_no,
        }
    }

    static async getUserList(tenant_id: number, data: GetUserListInput) {
        const {
            role = Role.TECHNICIAN,
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'user_id',
            orderBy = 'asc',
        } = data.query;

        const pageNumber = Math.max(1, page);
        const pageSize = Math.max(1, limit);
        const skip = (pageNumber - 1) * pageSize;

        const query: any = { tenant_id, role }

        if (search.trim()) {
            query.$or = [
                { user_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        const allowedSortFeilds = ['user_name', 'user_id', 'email']
        const safeSortBy = allowedSortFeilds.includes(sortBy) ? sortBy : "user_name"
        const sortDirection = orderBy === 'desc' || orderBy === "-1" ? -1 : 1
        const sortOptions: Record<string, 1 | -1> = { [safeSortBy]: sortDirection }

        const [userList, totalCount] = await Promise.all([
            User.find(
                query,
                "user_name user_id email address contact_no"
            )
                .sort(sortOptions)
                .skip(skip)
                .limit(pageSize)
                .lean(),
            User.countDocuments(query)
        ])

        const totalPages = Math.ceil(totalCount / pageSize)

        return {
            data: userList ?? [],
            metaData: {
                totalRecords: totalCount,
                currentPage: pageNumber,
                itemsPerPage: pageSize,
                totalPages: totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            },
        }
    }

    static async getTechnician(currUser: CurrUser, user_id: string) {
        let userId = Number(user_id)

        if (isNaN(userId))
            throw new AppError(400, "Invalid User Id Format")

        if (currUser.role == Role.TECHNICIAN && currUser.user_id != userId)
            throw new AppError(403, "Access Denied")

        let technician = await User.findOne({
            tenant_id: currUser.tenant_id,
            user_id: userId,
            role: Role.TECHNICIAN
        })

        if (!technician)
            throw new AppError(404, "Technician not found")

        return this.formatUser(technician)
    }

    static async createTechnician(tenant_id: number, data: CreateTechnicianInput) {
        let existingTechnician = await User.findOne({ tenant_id, email: data.email })

        if (existingTechnician)
            throw new AppError(409, "Technician already exists with provided email")
        let technician = { ...data, role: Role.TECHNICIAN }
        let newTechnician = await User.create({ tenant_id, ...technician })

        return this.formatUser(newTechnician)

    }

    static async updateTechnician(user: CurrUser, tech_id: string, data: UpdateTechnicianInput) {
        let techId = Number(tech_id)

        if (isNaN(techId))
            throw new AppError(400, "Invalid User Id Format")

        if (user.role == Role.TECHNICIAN && user.user_id != techId)
            throw new AppError(403, "Access Denied");


        let technician = await User.findOne({
            tenant_id: user.tenant_id,
            user_id: techId
        })

        if (!technician) throw new AppError(404, "Technician not found")
        if (technician.role !== Role.TECHNICIAN) {
            throw new AppError(403, "Target user is not a technician");
        }
        Object.assign(technician, data)

        await technician.save();

        return this.formatUser(technician.toObject());
    }

    static async deleteTechnician(tenant_id: number, user_id: string) {
        let deletedTechnician = await User.findOneAndDelete({
            tenant_id,
            user_id: Number(user_id),
        });

        if (!deletedTechnician) throw new AppError(404, "Technician Not Found");
    }

}
