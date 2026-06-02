import z from "zod"
import { AppError } from "./app-error"

export const validateRequest = (schema: z.ZodTypeAny) => {
    return (req: any, res: any, next: any) => {
        console.log("Validating request body:", req.body);
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues[0]?.message || "Invalid input data";
            return next(new AppError(message, 400));
        }

        req.body = result.data;
        next();
    }
}