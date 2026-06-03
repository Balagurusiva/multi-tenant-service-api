import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { CustomerServices } from "./customer.service";

export class CustomerController {
    static createCustomer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await CustomerServices.createCustomer(req.body);

        ApiResponse.send(res, 200, "Customer Created Successfully", result)
    })
} 