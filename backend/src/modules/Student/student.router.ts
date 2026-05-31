import { Router } from 'express';
import { listStudentsHandler, registerStudentHandler, updateStudentInfoHandler, deleteStudentHandler } from './student.controller';
import { validateRequest } from '../../middleware/validateRequest';
import {  registerStudentSchema, updateStudentSchema } from './student.validator';

const router = Router();


router.get('/', listStudentsHandler);
router.post('/register', validateRequest(registerStudentSchema), registerStudentHandler);
router.put('/:studentId', validateRequest(updateStudentSchema), updateStudentInfoHandler);
router.delete('/:studentId', deleteStudentHandler);

export default router;