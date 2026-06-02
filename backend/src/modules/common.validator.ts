import zod from "zod";

export const dateStringSchema = zod.string().refine((date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
}, "Invalid date format");

export const passwordSchema = zod
    .string()
    .min(9, "Password must be exactly 9 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const addressSchema = zod.object({
    houseNumber: zod.string().min(1, "House number is required"),
    street: zod.string().min(1, "Street is required"),
    barangay: zod.string().min(1, "Barangay is required"),
    cityMunicipality: zod.string().min(1, "City is required"),
    region: zod.string().min(1, "Region is required"),
    province: zod.string().min(1, "Province is required"),
});

export const personSchema = zod.object({
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    middleName: zod.string().nullable(),
    birthDate: dateStringSchema,
    contactNumber: zod.string().min(1, "Contact number is required").max(20, "Contact number must be at most 20 characters"),
    email: zod.string().email("Invalid email address"),
    address: addressSchema,
});



