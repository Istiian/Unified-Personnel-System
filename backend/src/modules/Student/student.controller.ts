import { getStudents } from './student.service';
import { NextFunction, Request, Response } from 'express';
import { AppError } from "../../middleware/app-error";
import { Person, Student } from '../common.type';
import { recordPersonalInfo, updatePersonalInfo } from '../Person/person.service';
import { registerStudent, updateStudentInfo, deleteStudentInfo } from './student.service';
import { checkUserExists } from '../common.utils';
import { checkRepeatPassword } from '../common.utils';
import { db } from '../../db/client';

export const listStudentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 25;
        
        const filter: any = {};
        if (req.query.status) filter.status = req.query.status as string;
        if (req.query.section) filter.section = req.query.section as string;
        if (req.query.studentType) filter.studentType = req.query.studentType as string;
        if (req.query.studentStatus) filter.studentStatus = req.query.studentStatus as string;
        if (req.query.courseId) filter.courseId = parseInt(req.query.courseId as string);
    
        console.log("Received filters:", filter);
        const students = await getStudents(page, limit, filter)
        res.json(students);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Failed to fetch students', 500));
    }
};

export const registerStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, studentData }: { personalData: Person, studentData: Student } = req.body;
        const data = await registerStudent({ personalData, studentData });

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            person: data.person,
            student: data.student
        });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Failed to register student', 500));
    }
};

export const updateStudentInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { personalData, studentData }: { personalData: Person, studentData: Student } = req.body;
        const studentIdParam = Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId;
        if (!studentIdParam) return next(new AppError('Missing studentId parameter', 400));
        const studentId = parseInt(studentIdParam, 10);

        if (Number.isNaN(studentId)){
            return next(new AppError('Invalid studentId', 400));
        } 

        const data = await updateStudentInfo(studentId, { personalData, studentData });
        res.status(200).json({
            success: true,
            message: "Student information updated successfully",
            person: data.updatedPersonalInfo,
            student: data.updatedStudentInfo
        });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Failed to update student', 500));
    }
};

export const deleteStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const studentIdParam = Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId;
        if (!studentIdParam) return next(new AppError('Missing studentId parameter', 400));
        
        const studentId = parseInt(studentIdParam, 10);
        
        if (Number.isNaN(studentId)){
            return next(new AppError('Invalid studentId', 400));
        }
        const deletedStudent = await deleteStudentInfo(studentId);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            student: deletedStudent
        });
    }catch(error){
        next(error instanceof AppError ? error : new AppError('Failed to delete student', 500));
    }
};

