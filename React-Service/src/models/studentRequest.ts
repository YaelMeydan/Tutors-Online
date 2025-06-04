import { Schema, model } from "mongoose";

const schema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    level: {
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    contact:{
        type: String,
        //required: true,
        //unique: true,
    },

}, { timestamps: true });

export const StudentRequest = model("StudentRequest", schema);