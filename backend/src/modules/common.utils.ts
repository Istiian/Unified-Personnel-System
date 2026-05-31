import {db} from '../db/client';
import {persons} from '../db/Person';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcrypt';

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

