import { AppError } from "../../utils/AppError";
import { Service } from "./service.model";
import {
  CreateServiceInput,
  DeleteGetServiceInput,
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
  static async updateService(data: UpdateServiceInput) {
    let updatedService = await Service.findOneAndUpdate(
      { service_id: data.params.service_id },
      {
        $set: data.body,
      },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedService) throw new AppError(404, "Service not found");

    return this.formatService(updatedService);
  }

  static async deleteService(data: DeleteGetServiceInput) {
    let deletedService = await Service.findOneAndDelete({
      service_id: data.params.service_id,
    });

    if (!deletedService) throw new AppError(404, "Service Not Found");
  }

  static async getService(data: DeleteGetServiceInput) {
    let service = await Service.findOne({ service_id: data.params.service_id });
    if (!service) throw new AppError(404, "Service Not Found");

    return this.formatService(service);
  }

  static async getServicesList(tenant_id: number) {
    let serviceList = await Service.find(
      {},
      "service_id service_name service_description cost est_duration_min is_active",
    ).lean();

    if (serviceList.length == 0) throw new AppError(200, "No Services");

    return serviceList;
  }
}
