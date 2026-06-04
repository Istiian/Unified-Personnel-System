import { Express, Request, Response, NextFunction } from "express";
import { db } from "../db/client";
import { persons } from "../db/Person";
import { permissionRoles } from "../db/PermissionRole";
import { verifyAccessToken } from "../modules/auth/auth.utils";
import { eq } from "drizzle-orm/";
import { AppError } from "./app-error";
import { formatTokenCredentials } from "../modules/auth/auth.utils";
import { FormatUserData } from "../modules/common.utils"
import {veritfyParam} from "../modules/common.utils";

type Permission = {
    role: string;
    scope: string;
}
export const hasPermission = (...requiredPermissions: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // console.log('Checking permissions for request:', req.method, req.path);
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const tokenCredentials = verifyAccessToken(token);

            const user = await db.query.persons.findFirst({
                where: eq(persons.personId, tokenCredentials.personId),
                columns: { personId: true, password: true },
                with: {
                    role:{
                        columns:{
                            name: true,
                        }
                    },
                    student: {
                        columns: { studentId: true }, with: {
                            course: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                    faculty: {
                        columns: { facultyId: true }, with: {
                            department: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                    admin: {
                        columns: { adminId: true }, with: {
                            office: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                    dean: {
                        columns: { deanId: true }, with: {
                            department: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                    programChair: {
                        columns: { programChairId: true }, with: {
                            course: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                    staff: {
                        columns: { staffId: true }, with: {
                            office: {
                                columns: {
                                    name: true,
                                }
                            }
                        }
                    },
                },
            });

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            console.log('User data retrieved from database:', user);
            const credentials = FormatUserData(user);
            console.log('User credentials:', credentials);

            const hasRequiredPermission = requiredPermissions.some(permission => {

                if (permission.role !== credentials.role) {
                    return false;
                }

                // If scope is "any", accept regardless of user's scope
                if (permission.scope === "any") {
                    return true;
                }
                if (permission.scope === "own") {
                    const id = Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId;
                    if (!id) {
                        throw new AppError('Resource ID not found in request parameters', 400);
                    }
                    const resourceId = veritfyParam(id, 'Resource ID');
                    return resourceId === credentials.studentId || resourceId === credentials.facultyId || resourceId === credentials.adminId || resourceId === credentials.deanId || resourceId === credentials.programChairId || resourceId === credentials.staffId;
                }

                // Otherwise require exact scope match
                return permission.scope === credentials.scope;
            });

            if (!hasRequiredPermission) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}
