import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        specialty: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);