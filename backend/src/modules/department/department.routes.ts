import {Router} from 'express';
import { createDepartmentHandler, getDepartmentHandler, updateDepartmentHandler, deleteDepartmentHandler } from './department.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validator';
import { hasPermission } from '../../middleware/hasPermission';


const departmentRouter = Router();

departmentRouter.post('/', hasPermission("personnel:create:any"), validateRequest(createDepartmentSchema), createDepartmentHandler);
departmentRouter.get('/', hasPermission("personnel:read:any"), getDepartmentHandler);
departmentRouter.put('/:departmentId', hasPermission("personnel:update:any"), validateRequest(updateDepartmentSchema), updateDepartmentHandler);
departmentRouter.delete('/:departmentId', hasPermission("personnel:delete:any"), deleteDepartmentHandler);

export default departmentRouter;
