"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRequest = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    subject: {
        type: String,
        required: true,
    },
    level: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        //required: true,
        //unique: true,
    },
}, { timestamps: true });
exports.StudentRequest = (0, mongoose_1.model)("StudentRequest", schema);
