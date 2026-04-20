import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { UserSerive } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { Role } from "../../types/global";

export class UserController {
    static getUserList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const tenant_id = req.user!.tenant_id
        const role = req.query.role as Role.TECHNICIAN | Role.CUSTOMER
        let result = await UserSerive.getUserList(tenant_id, { query: req.query as any })

        let msg = "List of " + (role == Role.TECHNICIAN ? "Technician" : Role.CUSTOMER)

        ApiResponse.send(res, 200, msg, result)
    })

    static getTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.params.user_id as string
        const result = await UserSerive.getTechnician(req.user, user_id)

        ApiResponse.send(res, 200, "Technician Details", result)
    })

    static createTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const tenant_id = req.user!.tenant_id
        const result = await UserSerive.createTechnician(tenant_id, req.body);

        ApiResponse.send(res, 200, "Technician Created Successfully", result)
    })

    static updateTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.params.user_id as string
        const result = await UserSerive.updateTechnician(
            req.user,
            user_id,
            { ...req.body }
        )

        ApiResponse.send(res, 200, "Technician Updated Successfully", result)
    })

    static deleteTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const tenant_id = req.user!.tenant_id
        const user_id = req.params.user_id as string
        await UserSerive.deleteTechnician(
            tenant_id,
            user_id
        )
        ApiResponse.send(res, 200, "Technician Deleted Successfully")
    })
}   
