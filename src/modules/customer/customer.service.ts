import { Role } from "../../types/global";
import { User } from "../users/user.model";
import { CreateCustomerInput } from "./customer.schema";

export class CustomerServices {
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

    static async createCustomer(data: CreateCustomerInput) {
        const newCustomer = await User.create({ ...data, role: Role.CUSTOMER })
        return this.formatUser(newCustomer)
    }
}
