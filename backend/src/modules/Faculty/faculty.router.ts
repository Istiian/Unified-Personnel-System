import { Router } from 'express';
import { createFacultyHandler, deleteFacultyHandler, listFacultiesHandler,getFacultyByIdHandler, updateFacultyHandler } from './faculty.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterFacultySchema, UpdateFacultySchema } from './faculty.validator';
import { hasPermission } from '../../middleware/hasPermission';

const facultyRouter = Router();

facultyRouter.post('/', hasPermission("personnel:create:any"), validateRequest(RegisterFacultySchema), createFacultyHandler);
facultyRouter.get('/', hasPermission("personnel:read:any"), listFacultiesHandler);
facultyRouter.get('/:facultyId', hasPermission("personnel:read:any", "personnel:read:self"), getFacultyByIdHandler);
facultyRouter.put('/:facultyId', hasPermission("personnel:update:any"), validateRequest(UpdateFacultySchema), updateFacultyHandler);
facultyRouter.delete('/:facultyId', hasPermission("personnel:delete:any"), deleteFacultyHandler);

export default facultyRouter;
