import bcrypt from "bcrypt";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document{
    name:string,
    email:string,
    resetToken?: string|undefined,
    resetTokenExpiry?: number|undefined,
    date: Date,
    password: string,
    comparePassword(password: string): Promise<Boolean>,
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetToken: {
        type: String,
        default: undefined
    },
    resetTokenExpiry: {
        type: Date,
        default: undefined
    }
});

userSchema.pre('save', async function name(next) {
    const user = this as IUser;
    
    if (!user.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword:string = await bcrypt.hash(user.password,salt);
    user.password = hashedPassword;
    next();
})

userSchema.methods.comparePassword =  async function comaprePass(password:string) {
    const user = this as IUser;
    console.log(password,user.password)
    return await bcrypt.compare(password,user.password);
}

export const User = mongoose.model<IUser>('user',userSchema);