import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "../../utils/counter.modal";

export interface IService extends Document {
    tenant?: mongoose.Types.ObjectId;
    tenant_id: number;
    service_id: string;
    service_name: string;
    est_duration_min: number;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
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
        trim: true
    },
    est_duration_min: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }

}, { timestamps: true });


// Generate service_id
serviceSchema.pre('save', async function (next) {
    const doc = this;

    if (doc.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'service_id' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        if (counter) {
            doc.service_id =`${doc.tenant_id}_${counter.sequence_value}`;
        } else {
            throw new Error("Failed to generate service ID");
        }
    }
});

export const Service = mongoose.model<IService>("Service", serviceSchema);