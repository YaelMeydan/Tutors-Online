import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
    subject: {
        type: String,
        required: true,
    },
    experience: { 
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    contact:{
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
},

}, { timestamps: true });

export const TeacherRequest = model("TeacherRequest", schema);