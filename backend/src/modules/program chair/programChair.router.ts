import { Router } from 'express';
import { createProgramChairHandler, deleteProgramChairHandler, getProgramChairHandler, updateProgramChairHandler } from './programChair.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterProgramChairSchema, UpdateProgramChairSchema } from './programChair.validator';

const programChairRouter = Router();

programChairRouter.post('/', validateRequest(RegisterProgramChairSchema), createProgramChairHandler);
programChairRouter.get('/', getProgramChairHandler);
programChairRouter.put('/:programChairId', validateRequest(UpdateProgramChairSchema), updateProgramChairHandler);
programChairRouter.delete('/:programChairId', deleteProgramChairHandler);

export default programChairRouter;