import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        birthDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);