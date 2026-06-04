import { Router } from 'express';
import { createProgramChairHandler, deleteProgramChairHandler, listProgramChairsHandler, getProgramChairByIdHandler, updateProgramChairHandler } from './programChair.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterProgramChairSchema, UpdateProgramChairSchema } from './programChair.validator';
import { hasPermission } from '../../middleware/hasPermission';

const route = Router();

route.post('/', hasPermission("personnel:create:any"), validateRequest(RegisterProgramChairSchema), createProgramChairHandler);
route.get('/', hasPermission("personnel:read:any"), listProgramChairsHandler);
route.get('/:programChairId', hasPermission("personnel:read:any", "personnel:read:self"), getProgramChairByIdHandler);
route.put('/:programChairId', hasPermission("personnel:update:any"), validateRequest(UpdateProgramChairSchema), updateProgramChairHandler);
route.delete('/:programChairId', hasPermission("personnel:delete:any"), deleteProgramChairHandler);

export default route;