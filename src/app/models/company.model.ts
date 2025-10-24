export interface Company {
    id: number;
    name: string;
    description?: string;
    maxBranches: number;
    currentBranchCount: number;
    createdByUsername: string;
    createdAt: Date;
    managers: ManagerInfo[];
}

export interface ManagerInfo {
    userId: number;
    username: string;
    email: string;
    assignedAt: Date;
}

export interface CreateCompanyRequest {
    name: string;
    description?: string;
    maxBranches: number;
    managerUserId: number;
}

export interface UpdateCompanyRequest {
    name?: string;
    description?: string;
    maxBranches?: number;
}

export interface AssignManagerRequest {
    managerUserId: number;
}
