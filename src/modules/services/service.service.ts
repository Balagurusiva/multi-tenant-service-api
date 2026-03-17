import { Query } from "mongoose";
import { AppError } from "../../utils/AppError";
import { Service } from "./service.model";
import {
  CreateServiceInput,
  DeleteGetServiceInput,
  GetServiceListInput,
  UpdateServiceInput,
} from "./service.schema";

export class ServiceService {
  private static formatService(service: any) {
    return {
      service_id: service.service_id,
      service_name: service.service_name,
      description: service.service_description,
      cost: service.cost,
      est_duration_min: service.est_duration_min,
    };
  }

  static async createService(tenant_id: number, data: CreateServiceInput) {
    const service = await Service.create({
      tenant_id,
      ...data,
    });

    return this.formatService(service);
  }
  static async updateService(tenant_id: number, data: UpdateServiceInput) {
    let updatedService = await Service.findOneAndUpdate(
      { tenant_id, service_id: data.params.service_id },
      {
        $set: data.body,
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedService) throw new AppError(404, "Service not found");

    return this.formatService(updatedService);
  }

  static async deleteService(tenant_id: number, data: DeleteGetServiceInput) {
    let deletedService = await Service.findOneAndDelete({
      tenant_id,
      service_id: data.params.service_id,
    });

    if (!deletedService) throw new AppError(404, "Service Not Found");
  }

  static async getService(tenant_id: number, data: DeleteGetServiceInput) {
    let service = await Service.findOne({
      tenant_id,
      service_id: data.params.service_id,
    });
    if (!service) throw new AppError(404, "Service Not Found");

    return this.formatService(service);
  }

  static async getServicesList(tenant_id: number, data: GetServiceListInput) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'service_id',
      orderBy = 'asc',
    } = data.query;

    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNumber - 1) * pageSize;

    const query: any = { tenant_id }

    if (search.trim()) {
      query.$or = [
        { service_name: { $regex: search, $options: "i" } },
        { service_description: { $regex: search, $options: "i" } }
      ]
    }

    const allowedSortFields = ["service_name", "service_description", "cost", "est_duration_min"]
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "service_name"
    const sortDirection = orderBy === "desc" || orderBy === "-1" ? -1 : 1;
    const sortOptions: Record<string, 1 | -1> = { [safeSortBy]: sortDirection };

    const [serviceList, totalCount] = await Promise.all([
      Service.find(
        query,
        "service_id service_name service_description cost est_duration_min is_active"
      )
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Service.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: serviceList ?? [],
      metadata: {
        totalRecords: totalCount,
        currentPage: pageNumber,
        itemsPerPage: pageSize,
        totalPages: totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    };
  }
}
