import { Application, RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from "./models/user";

interface AuthUser {
    sub: string; 
    userName: string; 
}

export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}


export function useAuth(app: Application) {
    app.post("/register", register);
    app.post("/login", login);
    app.use(expressjwt({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET!,
        requestProperty: 'user',
    }));

    app.use((err: any, req: Request, res: any, next: any) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('Invalid token');
        } else {
            next(err);
        }
    });
}

function createToken(userId: string, userName: string ) {
    return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!);
}

const register: RequestHandler = async (req, res) => {
    try {
        const { _id, email, fullName, password } = req.body;

        if (!email) {
            res.status(400).send("email is required");
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).send(`User with email ${email} already exists`);
            return;
        }

        const newUser = await User.create({ email, fullName, password }) as unknown as typeof User.prototype;


        res.json({
            token: createToken(newUser._id.toString(), newUser.fullName),
        });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).end();
    }
};

const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).send("email is required");
            return;
        }

        if (!password) {
            res.status(400).send("password is required"); 
            return;
        }

        const user = await User.findOne({ email }).select('+password') as { _id: any, fullName: string, isSamePassword: (password: string) => boolean }; 

        if (!user) {
            res.status(401).send("Invalid credentials"); 
            return;
        }

        if (!user.isSamePassword(password)) {
            res.status(401).send("Invalid credentials"); 
            return;
        }

        res.json({
            token: createToken(user._id.toString(), user.fullName),
        });
    } catch (err) {
        console.error("Error during login:", err); 
        res.status(500).end();
    }
};
