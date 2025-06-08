"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./auth");
const studentsPosts_1 = require("./routers/studentsPosts");
exports.app = (0, express_1.default)();
exports.app.use((0, body_parser_1.json)());
exports.app.use((0, cors_1.default)());
exports.app.use((req, _, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});
exports.app.use(express_1.default.static("React-app"));
(0, auth_1.useAuth)(exports.app);
exports.app.use("/studentsPosts", studentsPosts_1.router);
