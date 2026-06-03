import { Person } from '../common.type';

export type employeeStatus = 'active' | 'suspended' | 'terminated' | 'retired' | 'resigned';
export type employeeType = 'Full-time' | 'Part-time' | 'Contractual';

export interface ProgramChairInfo {
    programChairId?: number;
    courseId: number;
    startDate: string;
    status?: employeeStatus;
    type: employeeType;
}

export interface ProgramChair {
    personalData: Person;
    programChairData: ProgramChairInfo;
}

export type ProgramChairFilter = {
    programChairId?: number;
    personId?: number;
    courseId?: number;
    startDate?: string;
    status?: employeeStatus;
    type?: employeeType;
    search?: string;
};