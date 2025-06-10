"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const studentRequest_1 = require("../models/studentRequest");
//import { Types } from "mongoose";
exports.router = (0, express_1.Router)();
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield studentRequest_1.StudentRequest.create(req.body);
        res.status(201);
        res.end();
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
}));
exports.router.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentsPosts = yield studentRequest_1.StudentRequest.find();
        res.json(studentsPosts);
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
}));
exports.router.get("/:subject", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentrequest = yield studentRequest_1.StudentRequest.find({
            subject: req.params.subject,
        });
        if (!studentrequest || studentrequest.length === 0) {
            res.status(404);
            res.send(`No posts found for subject ${req.params.subject}`);
            return;
        }
        res.json(studentrequest);
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
}));
exports.router.get;
