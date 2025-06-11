import { Application, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from "./models/user";

export function useAuth(app: Application) {
    app.post("/register", register);
    app.post("/login", login);
    app.use(expressjwt({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET!,
    }));
}

function createToken(userId: string, userName: string ) {
    return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!);
}

const register: RequestHandler = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;

        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409);
            res.send(`User with email ${email} already exists`);
            return;
        }

        const newUser = await User.create({ email, fullName });

        newUser.password = password;

        await newUser.save();

        res.json({
            token: createToken(newUser.id, newUser.fullName),
        });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
};

const login: RequestHandler = async (req, res) => {
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

        const user = await User.findOne({ email }).schemaLevelProjections(false);

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
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
};
