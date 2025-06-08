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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = require("express-jwt");
const user_1 = require("./models/user");
function useAuth(app) {
    app.post("/register", register);
    app.post("/login", login);
    app.use((0, express_jwt_1.expressjwt)({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET,
    }));
}
function createToken(userId, userName) {
    return jsonwebtoken_1.default.sign({ sub: userId, userName }, process.env.SESSION_SECRET);
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, fullName, password } = req.body;
        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            res.status(409);
            res.send(`User with email ${email} already exists`);
            return;
        }
        const newUser = yield user_1.User.create({ email, fullName });
        newUser.password = password;
        yield newUser.save();
        res.json({
            token: createToken(newUser.id, newUser.fullName),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }
        if (!password) {
            res.status(400);
            res.send("password is required");
            return;
        }
        const user = yield user_1.User.findOne({ email }).schemaLevelProjections(false);
        if (!user) {
            res.status(401);
            res.end();
            return;
        }
        if (!user.isSamePassword(password)) {
            res.status(401);
            res.end();
            return;
        }
        res.json({
            token: createToken(user.id, user.fullName),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
});
