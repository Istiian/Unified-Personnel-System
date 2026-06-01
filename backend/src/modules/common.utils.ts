import {db} from '../db/client';
import {persons} from '../db/Person';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcrypt';
import {createTransport} from 'nodemailer';
import { AppError } from '../middleware/app-error';
import { sendEmailRequest } from './auth/type.auth';

const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const checkUserExists = async (email: string): Promise<boolean> => {
    const existingUser = await db.select().from(persons).where(eq(persons.email, email));
    console.log("Existing user check result:", existingUser);
    return existingUser.length > 0;
}

export const checkRepeatPassword = (password: string, confirmPassword: string): boolean => {
    return password !== confirmPassword;
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};


export const sendEmail = async (emailData: sendEmailRequest) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
        });
    } catch (error) {
        throw new AppError('Failed to send email', 500);
    }
};