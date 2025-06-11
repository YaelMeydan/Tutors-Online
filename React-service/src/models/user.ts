import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
    isSamePassword(candidatePassword: string): Promise<boolean>;
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
        select: false,
    },

}, { timestamps: true }); 

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: any) {
        next(err);
    }
});

userSchema.methods.isSamePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};


export const User = model<IUser>('User', userSchema);
