import {registerUserHandler, 
    updateUserInfoHandler} from "./user.controller";
import { Router } from "express";

const router = Router();

router.post('/', registerUserHandler);
router.patch('/:id', updateUserInfoHandler);

export default router;