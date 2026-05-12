import { NextFunction, Request, Response } from "express";
import { TenantService } from "./tenant.service";
import { catchAsync } from "../../utils/CatchAsync";
import { ApiResponse } from "../../utils/ApiResponse";
import { ServiceService } from "../services/service.service";

export class TenantController {
    static registerTenant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TenantService.createTenantAndAdmin(req.body);
        ApiResponse.send(res, 201, "Organization created successfully", result);
    })

    static getTenantsList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TenantService.getTenantList(req.query as any)
        ApiResponse.send(res, 200, "List Tenants Available", result)
    })

    static getTenant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await TenantService.getTenant(req.params as any)
        ApiResponse.send(res, 200, "Tenant Details", result)
    })

    static getTenantServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
        const tenant_id = await TenantService.getTenantIdBySlug(slug);
        const result = await ServiceService.getServicesList(tenant_id, { query: req.query as any });
        ApiResponse.send(res, 200, "Tenant Services List", result);
    });
}
