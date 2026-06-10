import {registerUser} from "./user.controller";
import { Router } from "express";

const router = Router();

router.post('/', registerUser);

export default router;