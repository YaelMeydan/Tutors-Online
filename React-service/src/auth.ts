import { Application, RequestHandler, Request } from "express"; // Import Request
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from "./models/user"; // Assuming this path is correct

// Define the structure of the user object attached by the auth middleware
// Based on your createToken function, the payload has 'sub' and 'userName'
interface AuthUser {
    sub: string; // User ID (from JWT 'sub' claim)
    userName: string; // User name
    // Add other properties if your token payload includes them
}

// Extend the Express Request type to include the 'user' property
export interface AuthenticatedRequest extends Request {
    user?: AuthUser; // Use '?' if the user property might not always be present (e.g., on public routes)
}


export function useAuth(app: Application) {
    app.post("/register", register);
    app.post("/login", login);

    // Apply express-jwt middleware
    // Configure it to attach the decoded token to req.user
    app.use(expressjwt({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET!,
        // Add this option to put the decoded token on req.user
        requestProperty: 'user',
    }));

    // Add an error handler for express-jwt (optional but recommended)
    app.use((err: any, req: Request, res: any, next: any) => {
        if (err.name === 'UnauthorizedError') {
            // If the token is missing or invalid, send 401 Unauthorized
            res.status(401).send('Invalid token');
        } else {
            // Pass other errors to the next error handler
            next(err);
        }
    });
}

function createToken(userId: string, userName: string ) {
    // Use 'sub' for the user ID as it's a standard JWT claim
    return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!);
}

const register: RequestHandler = async (req, res) => {
    try {
        const { _id, email, fullName, password } = req.body;

        if (!email) {
            res.status(400).send("email is required"); // Use send() for body
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).send(`User with email ${email} already exists`); // Use send() for body
            return;
        }

        // Assuming User.create handles password hashing internally or you do it here
        const newUser = await User.create({ email, fullName, password }) as unknown as typeof User.prototype; // Explicitly type newUser as a User instance

        // If your model requires setting password separately after creation:
        // newUser.password = password;
        // await newUser.save();


        res.json({
            // Use newUser._id as the user ID
            token: createToken(newUser._id.toString(), newUser.fullName), // Convert ObjectId to string
        });
    } catch (err) {
        console.error("Error during registration:", err); // Add context to error log
        res.status(500).end();
    }
};

const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).send("email is required"); // Use send() for body
            return;
        }

        if (!password) {
            res.status(400).send("password is required"); // Use send() for body
            return;
        }

        // Select the password field explicitly if it's excluded by default
        const user = await User.findOne({ email }).select('+password') as { _id: any, fullName: string, isSamePassword: (password: string) => boolean }; // Type assertion

        if (!user) {
            res.status(401).send("Invalid credentials"); // Provide a generic error message
            return;
        }

        // Assuming isSamePassword is a method on your User model
        if (!user.isSamePassword(password)) {
            res.status(401).send("Invalid credentials"); // Provide a generic error message
            return;
        }

        res.json({
            // Use user._id as the user ID
            token: createToken(user._id.toString(), user.fullName), // Convert ObjectId to string
        });
    } catch (err) {
        console.error("Error during login:", err); // Add context to error log
        res.status(500).end();
    }
};
