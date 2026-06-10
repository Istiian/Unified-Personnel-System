import {Request, Response, NextFunction} from "express";
import {createUser, updateUserInfo} from "./user.service";
import {generateCredentialSlip} from "../../utils/credentialSlip";

export const registerUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const createdUser = await createUser(userData);
        const credentialSlip = generateCredentialSlip(createdUser.username, createdUser.password);
        res.setHeader('Content-Type', 'application/pdf');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        next(error);
    }
}

export const updateUserInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Array.isArray(req.params.id) ? parseInt(req.params.id[0]) : parseInt(req.params.id);
        
        const userData = req.body;
        const updatedUser = await updateUserInfo(userId, userData);
        res.status(200).json({
            success: true,
            message: 'User information updated successfully',
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}