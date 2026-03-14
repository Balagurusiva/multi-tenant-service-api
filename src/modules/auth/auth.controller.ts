import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/CatchAsync";
import { ApiResponse } from "../../utils/ApiResponse";

export class AuthController{
    static login = catchAsync(async (req:Request, res: Response, next: NextFunction) => {
        const result = await AuthService.userLogin(req.body)

        ApiResponse.send(res, 200, "Login successfull", result)
    })
}