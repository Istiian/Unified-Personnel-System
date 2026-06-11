import {
    registerUserHandler, 
    updateUserInfoHandler,
    getUserByIdHandler,
    listUsersHandler
} from "./user.controller";
import { Router } from "express";

const router = Router();

router.post('/', registerUserHandler);
router.patch('/:id', updateUserInfoHandler);
router.get('/:id', getUserByIdHandler);
router.get('/', listUsersHandler);


export default router;