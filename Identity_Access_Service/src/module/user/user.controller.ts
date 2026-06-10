import {Request, Response, NextFunction} from "express";
import {createUser} from "./user.service";
import {generateCredentialSlip} from "../../utils/credentialSlip";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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