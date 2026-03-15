import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "../../utils/counter.modal";

export interface IService extends Document {
  tenant_id: number;
  service_id: string;
  service_name: string;
  service_description?: string;
  est_duration_min: number;
  cost: number;
  is_active: "ACTIVE" | "DISCONNECTED";
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
  tenant_id: {
    type: Number,
    required: true,
    index: true
  },
  service_id: {
    type: String,
    unique: true,
    index: true
  },
  service_name: {
    type: String,
    required: true,
  },
  service_description: {
    type: String,
    trim: true
  },
  est_duration_min: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  is_active: {
    type: String,
    default: "ACTIVE",
  },

}, { timestamps: true });


// Generate service_id
serviceSchema.pre("validate", async function (next) {
  const doc = this;

  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: `service_${doc.tenant_id}` },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true },
    );

    if (counter) {
      doc.service_id = `T${doc.tenant_id}_${counter.sequence_value}`;
    } else {
      throw new Error("Failed to generate service ID");
    }
  }
});

serviceSchema.index({ tenant_id: 1, service_name: 1 }, { unique: true });

export const Service = mongoose.model<IService>("Service", serviceSchema);
