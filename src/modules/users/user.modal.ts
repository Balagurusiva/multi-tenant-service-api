import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "../../utlis/counter.modal";

export interface IUser extends Document {
    tenant?: mongoose.Types.ObjectId,
    tenant_id?: number;
    user_id: number;
    user_name: string;
    role: 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER'
    email: string;
    contact_no: number;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: function (this: IUser) {
            return this.role === 'ADMIN' || this.role === 'TECHNICIAN';
        }
    },
    tenant_id: {
        type: Number,
        index: true,
        required: function (this: IUser) {
            return this.role === 'ADMIN' || this.role === 'TECHNICIAN';
        }
    },
    user_id: {
        type: Number,
        unique: true,
        index: true,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'TECHNICIAN', 'CUSTOMER'],
        default: 'CUSTOMER'
    },
    contact_no: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        maxLength: 200
    }
}, { timestamps: true }
)

//user_id
userSchema.pre('save', async function (next) {
    const doc = this;

    if (doc.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'user_id' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        )
        if (counter) {
            doc.user_id = counter.sequence_value + 100
        } else {
            throw new Error("Faild to generate user ID")
        }
    }
})

export const User = mongoose.model<IUser>("UserSchema", userSchema)