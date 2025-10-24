export interface Branch {
    id: number;
    companyId: number;
    companyName: string;
    name: string;
    address?: string;
    isMainBranch: boolean;
    createdByUsername: string;
    createdAt: Date;
    employeeCount: number;
    assignedUsers?: BranchUser[];
}

export interface BranchUser {
    userId: number;
    username: string;
    email: string;
    assignedAt: Date;
}

export interface CreateBranchRequest {
    companyId: number;
    name: string;
    address?: string;
}

export interface UpdateBranchRequest {
    name?: string;
    address?: string;
}

export interface AssignUserToBranchRequest {
    userId: number;
}
