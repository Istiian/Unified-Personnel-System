import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../middleware/app-error';
import { generateCredentialSlip } from '../common.utils';
import { Person } from '../common.type';
import { createProgramChair, deleteProgramChair, getProgramChair, updateProgramChair } from './programChair.service';
import { ProgramChairInfo } from './programChair.type';

export const createProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { programChairData, personalData }: { programChairData: ProgramChairInfo, personalData: Person } = req.body;
        const newProgramChair = await createProgramChair({ programChairData, personalData });
        const credentialSlip = generateCredentialSlip(newProgramChair.username, newProgramChair.password);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="account-slip.pdf"');
        credentialSlip.pipe(res);
        credentialSlip.end();
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to create program chair', 500));
    }
};

export const getProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;

        const filter: any = {};
        if (req.query.programChairId) filter.programChairId = parseInt(req.query.programChairId as string);
        if (req.query.personId) filter.personId = parseInt(req.query.personId as string);
        if (req.query.courseId) filter.courseId = parseInt(req.query.courseId as string);
        if (req.query.startDate) filter.startDate = req.query.startDate as string;
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.type) filter.type = req.query.type as string;
        if (req.query.search) filter.search = req.query.search as string;

        const programChairList = await getProgramChair(page, limit, filter);

        res.status(200).json({
            message: 'Program chair retrieved successfully',
            success: true,
            programChair: programChairList,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to retrieve program chair', 500));
    }
};

export const updateProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const programChairIdParam = Array.isArray(req.params.programChairId) ? req.params.programChairId[0] : req.params.programChairId;
        if (!programChairIdParam) {
            return next(new AppError('Missing programChairId parameter', 400));
        }

        const programChairId = parseInt(programChairIdParam, 10);
        if (Number.isNaN(programChairId)) {
            return next(new AppError('Invalid programChairId', 400));
        }

        const { programChairData, personalData }: { programChairData: ProgramChairInfo, personalData: Person } = req.body;
        const updatedProgramChair = await updateProgramChair(programChairId, { programChairData, personalData });

        res.status(200).json({
            success: true,
            message: 'Program chair updated successfully',
            programChair: updatedProgramChair,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to update program chair', 500));
    }
};

export const deleteProgramChairHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const programChairIdParam = Array.isArray(req.params.programChairId) ? req.params.programChairId[0] : req.params.programChairId;
        if (!programChairIdParam) {
            return next(new AppError('Missing programChairId parameter', 400));
        }

        const programChairId = parseInt(programChairIdParam, 10);
        if (Number.isNaN(programChairId)) {
            return next(new AppError('Invalid programChairId', 400));
        }

        const deletedProgramChair = await deleteProgramChair(programChairId);
        if (!deletedProgramChair) {
            return next(new AppError('Program chair not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Program chair deleted successfully',
            programChair: deletedProgramChair,
        });
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(new AppError('Failed to delete program chair', 500));
    }
};