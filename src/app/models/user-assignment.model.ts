export interface UserCompanyAssignment {
    id: number;
    name: string;
    description?: string;
    assignedAt: Date;
}

export interface UserBranchAssignment {
    branchId: number;
    branchName: string;
    branchAddress?: string;
    isMainBranch: boolean;
    companyId: number;
    companyName: string;
    assignedAt: Date;
}

export interface UserNavigationResponse {
    role: string;
    navigation: CompanyNavigation[];
}

export interface CompanyNavigation {
    companyId: number;
    companyName: string;
    companyDescription?: string;
    assignedAt?: Date;
    branches: BranchNavigation[];
}

export interface BranchNavigation {
    branchId: number;
    branchName: string;
    branchAddress?: string;
    isMainBranch: boolean;
    isAssignedToBranch: boolean;
    companyId: number;
    companyName: string;
    assignedAt?: Date;
}
