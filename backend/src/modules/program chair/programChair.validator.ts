import z from 'zod';
import { dateStringSchema, personSchema } from '../common.validator';

const employeeStatusValues = ['active', 'suspended', 'terminated', 'retired', 'resigned'] as const;
const employeeTypeValues = ['Full-time', 'Part-time', 'Contractual'] as const;

export const ProgramChairDataSchema = z.object({
    courseId: z.number().int().positive('Course ID must be a positive integer'),
    startDate: dateStringSchema,
    status: z.enum(employeeStatusValues).optional(),
    type: z.enum(employeeTypeValues),
});

export const RegisterProgramChairSchema = z.object({
    personalData: personSchema,
    programChairData: ProgramChairDataSchema,
});

export const UpdateProgramChairSchema = z.object({
    personalData: personSchema.partial(),
    programChairData: ProgramChairDataSchema.partial(),
}).refine((data) => Boolean(data.personalData) || Boolean(data.programChairData), {
    message: 'At least one of personalData or programChairData is required',
});