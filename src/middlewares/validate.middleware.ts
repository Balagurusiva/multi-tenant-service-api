import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate = (schema: ZodType<any, any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as { body?: any; query?: any; params?: any };

            if (validatedData.body) {
                req.body = validatedData.body;
            }

            if (validatedData.query) {
                Object.defineProperty(req, 'query', {
                    value: validatedData.query,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }

            if (validatedData.params) {
                Object.defineProperty(req, 'params', {
                    value: validatedData.params,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }
            next(error);
        }
    };
};