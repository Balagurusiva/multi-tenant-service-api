import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { AppError } from "../utils/AppError";
import 'dotenv/config';
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { jwtPayload } from "../types/express";
import { decode } from "node:punycode";

export const protect = catchAsync((req: Request, res: Response, next: NewableFunction) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token)
        throw new AppError(401, "You are not logged in. Please login to continue")

    try {
        const secret = process.env.JWT_SECRET!
        const decoded = jwt.verify(token, secret) as jwtPayload

        req.user = decoded
        next();
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError(401, "Your token has expired. Please log in again."))
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError(401, "Invalid token. Please log in again."))
        }

        return next(error)
    }
})


export const restrictTo = (...allowedRoles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(500, "User context not found. Ensure protect middleware is applied first."))
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have permission to perform this action'));
        }

        next();
    }
}