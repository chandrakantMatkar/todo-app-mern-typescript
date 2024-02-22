import dotenv from "dotenv";
import * as nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
    // service: process.env.EMAIL_SERVICE as string,
    host: process.env.EMAIL_HOST as string,
    port: 465,
    secure: true,
    // debug: true,
    // logger: true,
    // secureConnection: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
    }
});


export default transporter;  