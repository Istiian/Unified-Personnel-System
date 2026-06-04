import {Router} from 'express';
import { createCourseHandler, getCourseHandler, updateCourseHandler, deleteCourseHandler } from './course.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createCourseSchema, updateCourseSchema } from './course.validator';
import { hasPermission } from '../../middleware/hasPermission';
const courseRouter = Router();

courseRouter.post('/', hasPermission("personnel:create:any"), validateRequest(createCourseSchema), createCourseHandler);
courseRouter.get('/', hasPermission("personnel:read:any"), getCourseHandler);
courseRouter.put('/:courseId', hasPermission("personnel:update:any"), validateRequest(updateCourseSchema), updateCourseHandler);
courseRouter.delete('/:courseId', hasPermission("personnel:delete:any"), deleteCourseHandler);

export default courseRouter;