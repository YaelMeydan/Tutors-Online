import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt'; // You need to install bcrypt: npm install bcrypt @types/bcrypt

// Define the interface for your User document
interface IUser extends Document {
    email: string;
    fullName: string;
    password: string; // Store the hashed password as a string
    // Add other fields as needed
    isSamePassword(candidatePassword: string): Promise<boolean>; // Method for password comparison
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        // By default, don't include the password in query results
        select: false,
    },
    // Add other schema fields here
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: any) {
        // Pass any errors to the next middleware (Mongoose error handler)
        next(err);
    }
});

// Method to compare a candidate password with the stored hashed password
userSchema.methods.isSamePassword = async function(candidatePassword: string): Promise<boolean> {
    // Use bcrypt.compare to safely compare the plain password with the hashed one
    return bcrypt.compare(candidatePassword, this.password);
};


export const User = model<IUser>('User', userSchema);
