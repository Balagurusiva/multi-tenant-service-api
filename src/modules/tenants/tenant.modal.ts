import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "../../utlis/counter.modal";

export interface ITenent extends Document {
    tenant_id: number;
    name: string;
    slug: string;
    email: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}

const tenantSchema = new Schema<ITenent>({
    tenant_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        time: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
        default: 'ACTIVE'
    },


}, {
    timestamps: true
})

//tenet_id
tenantSchema.pre('save', async function (next) {
    const doc = this;

    if (doc.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'tenant_id' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        )
        if (counter) {
            doc.tenant_id = counter.sequence_value
        } else {
            throw new Error("Faild to generate tenent ID")
        }


    }
})

export const Tenant = mongoose.model<ITenent>("TenantSchema", tenantSchema)