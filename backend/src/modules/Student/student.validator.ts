import z from "zod";

const studentStatusValues = ["active", "graduated", "dropped", "suspended"] as const;
const studentTypeValues = ["regular", "irregular"] as const;

const dateStringSchema = z.string().refine((date) => {
    const parsedDate = Date.parse(date);
    return !isNaN(parsedDate);
}, "Invalid date format");

const passwordSchema = z
    .string()
    .min(9, "Password must be exactly 9 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const addressSchema = z.object({
    houseNumber: z.string().min(1, "House number is required"),
    street: z.string().min(1, "Street is required"),
    barangay: z.string().min(1, "Barangay is required"),
    cityMunicipality: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    province: z.string().min(1, "Province is required"),
});

const personSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().nullable(),
    birthDate: dateStringSchema,
    contactNumber: z.string().min(1, "Contact number is required").max(20, "Contact number must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    repeatPassword: passwordSchema,
    address: addressSchema,
})

const studentDataSchema = z.object({
    enrollmentDate: dateStringSchema,
    courseId: z.number().int().positive("Course ID must be a positive integer"),
    status: z.enum(studentStatusValues).optional(),
    section: z.string().min(1, "Section is required"),
    studentType: z.enum(studentTypeValues),
});

const updatePersonSchema = personSchema.omit({ password: true, repeatPassword: true }).partial();
const updateStudentDataSchema = studentDataSchema.partial();


export const registerStudentSchema = z.object({
    personalData: personSchema.extend({
        role: z.literal("student"),
    }).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
}),
    studentData: studentDataSchema,
});

export const updateStudentSchema = z.object({
    personalData: updatePersonSchema.optional(),
    studentData: updateStudentDataSchema.optional(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.studentData), {
    message: "At least one of personalData or studentData is required",
});

