import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import mailer from '../Middleware/mailer';
import crypto from "crypto";
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: string,
                email?: string,
                expiry?: number
            } | JwtPayload,
            resetToken?: string | undefined,
            resetTokenExpiry?: string | undefined,
        }
    }
}

interface UserData {
    name: string,
    email: string,
    password: string,
    date?: Date,
    resetToken?: string | undefined,
    resetTokenExpiry?: string | undefined,

}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select('name email date');
        if (!users) {
            return res.status(404).send(`users not found.`)
        }
        res.status(200).json(users);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('name email date');
        if (!user) {
            return res.status(404).send(`user not found.`)
        }
        res.status(200).json(user);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export const postSignUp = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const { name, email, password } = req.body;
        // const salt = await bcrypt.genSalt(12);
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send('User exist with this email. try with different address.')
        }
        // const hashedPassword = await bcrypt.hash(password,salt) //genSalt(12)
        user = await User.create({
            name: name,
            email: email,
            password: password,
        });
        const authToken = jwt.sign({ email: user.email, id: user._id, expiry: Math.floor(Date.now() / 1000) + 60 * 60 }, process.env.JWT_PRIVATE_KEY as jwt.Secret)
        res.status(200).json({ authToken });
    } catch (error) {
        return res.sendStatus(500);
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // const { name, email, password } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send(`user not found.`)
        }
        const modifiedFields: { [key: string]: string } = {}
        for (const key in req.body) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                if (user.get(key) !== req.body[key]) {
                    modifiedFields[key] = req.body[key];
                }
            }
        }
        if (Object.keys(modifiedFields).length <= 0) {
            return res.status(400).send('no changes detected to update');
        }
        if (modifiedFields['password']) {
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(modifiedFields['password'], salt);
            modifiedFields['password'] = hash;
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, modifiedFields, { new: true }).select("-password")
        res.status(200).json(updatedUser);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('no such item exists.');
        }
        user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        return res.status(500)
    }
}

export const postForgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(400).send('Invalid Username.');
        }
        //creating unique token and hashing to save in the database.
        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
        user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();
        const resetLink = `${process.env.BASE_URL}/reset-password?token=${user.resetToken}` //`http://localhost:3000/reset-password?token=${user.resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Reset your password for tech solutiopn testing website.',
            text: `Click on the link to proceed.${resetLink}`
        }
        mailer.sendMail(mailOptions, (error: any, info: { response: string; }) => {
            if (error) {
            } else {
                res.status(200).send({message:info.response, token: user.resetToken });
            }
        });
    } catch (error: any) {
        res.status(500).send({ error: error.message, message: 'Internal Server Error' })
    }
}

export const postResetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() }
            }
        })
        if (!user) {
            return res.status(400).send('Invalid Token. Kindly provide a valid')
        }
        // for encrypting password.
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.status(200).send('Password updated successfully.');
    } catch (error: any) {
        res.status(500).send({ error: error.message, message: 'Internal Server Error' })
    }
}

export const postLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('email or password is missing.')
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('User not exist.');
        }
        const passMatched = await user.comparePassword(password);
        if (!passMatched) {
            return res.status(400).send('Invalid Password.')
        }
        const authToken = await jwt.sign({ email: user.email, id: user._id, expiry: Math.floor(Date.now() / 1000) + 60 * 60 }, process.env.JWT_PRIVATE_KEY as jwt.Secret);
        res.status(200).json({ authToken });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}