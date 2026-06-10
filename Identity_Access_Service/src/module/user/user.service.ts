import { user } from "../../db/user";
import { db } from "../../db/client"
import { RegisterUser} from "./user.type";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../lib/bcrypt";
import {desc, eq} from "drizzle-orm";
import { randomBytes } from "crypto";

export const createUser = async (userData: RegisterUser): Promise<{ username: string; password: string }> => {
    const existingUser = await db.select()
        .from(user)
        .where(eq(user.email, userData.email))
        .limit(1);
    if (existingUser.length > 0) {
        throw new AppError('Email already exists', 400);
    }
    const [lastRow] = await db
      .select()
      .from(user)
      .orderBy(desc(user.userId))
      .limit(1);
    
    const generatedUsername = `${userData.lastName.toUpperCase()}${new Date().getFullYear()}${(lastRow?.userId || 0) + 1}`;
    const generatedPassword = randomBytes(16).toString('base64').slice(0, 16);
    const hashedPassword = await hashPassword(generatedPassword);
    
    await db.insert(user).values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        email: userData.email,
        contactNumber: userData.contactNumber,
        username: generatedUsername,
        password: hashedPassword,
        houseNumber: userData.houseNumber,
        street: userData.street,
        barangay: userData.barangay,
        cityMunicipality: userData.cityMunicipality,
        region: userData.region,
        province: userData.province,
        role: userData.role
    })
    
    return {
        username: generatedUsername,
        password: generatedPassword
    };
}

