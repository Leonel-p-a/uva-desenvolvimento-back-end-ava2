import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Patient", PatientSchema);