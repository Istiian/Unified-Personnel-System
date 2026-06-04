import { Express, Request, Response, NextFunction } from "express";
import { db } from "../db/client";
import { persons } from "../db/Person";
import { permissionRoles } from "../db/PermissionRole";
import { verifyAccessToken } from "../modules/auth/auth.utils";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import {AppError} from "../middleware/app-error";


export const hasPermission = (...permission: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new AppError('Unauthorized', 401);
            }

            const tokenCredentials = verifyAccessToken(token);

            // Fetch the user's role and permissions from the database
            const userPermissions = await db.query.permissionRoles.findMany({
                where: eq(permissionRoles.roleId, tokenCredentials.role),
                with:{
                    permission: {
                        columns: {
                            name: true,
                        }
                    }
                }
            });

            console.log('User permissions:', userPermissions.map(up => up.permission.name));

            const hasRequiredPermission = userPermissions.some(up => permission.includes(up.permission.name));
            console.log('Has required permission:', hasRequiredPermission);
            if (!hasRequiredPermission) {
                throw new AppError('Forbidden', 403);
            }
           
            next();
        } catch (error) {
            console.error('Permission error:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            throw error;
        }
    }
}
