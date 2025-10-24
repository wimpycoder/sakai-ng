import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BranchService } from '../service/branch.service';
import { UserService, User } from '../service/user.service';
import { UserAssignmentService } from '../service/user-assignment.service';
import { Branch, CreateBranchRequest, UpdateBranchRequest, AssignUserToBranchRequest } from '../../models/branch.model';
import { CompanyNavigation } from '../../models/user-assignment.model';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-branch-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        TagModule,
        SelectModule,
        ToolbarModule,
        TooltipModule,
        InputTextModule,
        DrawerModule,
        ConfirmDialogModule,
        MultiSelectModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <h5 class="m-0">Branch Management</h5>
            </ng-template>
            <ng-template #end>
                <div class="flex gap-2 items-center">
                    <label class="font-semibold">Company:</label>
                    <p-select
                        [(ngModel)]="selectedCompanyId"
                        [options]="companies"
                        optionLabel="companyName"
                        optionValue="companyId"
                        placeholder="Select Company"
                        (onChange)="onCompanyChange()"
                        [style]="{ 'min-width': '200px' }" />
                    <p-button
                        label="New Branch"
                        icon="pi pi-plus"
                        [disabled]="!selectedCompanyId"
                        (click)="showCreateDialog()" />
                </div>
            </ng-template>
        </p-toolbar>

        <p-table
            [value]="branches"
            [loading]="loading"
            [tableStyle]="{ 'min-width': '70rem' }"
            [rowHover]="true"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 20, 30]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} branches"
            dataKey="id">
            <ng-template #header>
                <tr>
                    <th style="min-width: 4rem">ID</th>
                    <th style="min-width: 12rem">Branch Name</th>
                    <th style="min-width: 18rem">Address</th>
                    <th style="min-width: 8rem">Type</th>
                    <th style="min-width: 8rem">Employees</th>
                    <th style="min-width: 10rem">Created By</th>
                    <th style="min-width: 14rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-branch>
                <tr>
                    <td>{{ branch.id }}</td>
                    <td>
                        <span class="font-bold">{{ branch.name }}</span>
                        <i *ngIf="branch.isMainBranch" class="pi pi-star-fill text-yellow-500 ml-2"></i>
                    </td>
                    <td>{{ branch.address || 'N/A' }}</td>
                    <td>
                        <p-tag
                            [value]="branch.isMainBranch ? 'Main' : 'Branch'"
                            [severity]="branch.isMainBranch ? 'warn' : 'info'" />
                    </td>
                    <td>
                        <p-tag
                            [value]="branch.employeeCount.toString()"
                            severity="success" />
                    </td>
                    <td>{{ branch.createdByUsername }}</td>
                    <td>
                        <p-button
                            icon="pi pi-users"
                            label="Assign"
                            [rounded]="true"
                            [outlined]="true"
                            severity="success"
                            class="mr-2"
                            (click)="showAssignDrawer(branch)"
                            pTooltip="Assign Users" />
                        <p-button
                            icon="pi pi-pencil"
                            [rounded]="true"
                            [outlined]="true"
                            severity="info"
                            class="mr-2"
                            (click)="showEditDialog(branch)"
                            pTooltip="Edit" />
                        <p-button
                            icon="pi pi-trash"
                            [rounded]="true"
                            [outlined]="true"
                            severity="danger"
                            (click)="deleteBranch(branch)"
                            pTooltip="Delete" />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="7" class="text-center">
                        {{ selectedCompanyId ? 'No branches found for this company' : 'Please select a company' }}
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Create/Edit Branch Dialog -->
        <p-dialog
            [(visible)]="displayBranchDialog"
            [header]="isEditMode ? 'Edit Branch' : 'Create New Branch'"
            [modal]="true"
            [style]="{ width: '500px' }">
            <ng-template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="name" class="block font-bold mb-2">Branch Name *</label>
                        <input
                            pInputText
                            id="name"
                            [(ngModel)]="branchForm.name"
                            placeholder="Enter branch name"
                            class="w-full" />
                    </div>

                    <div>
                        <label for="address" class="block font-bold mb-2">Address</label>
                        <input
                            pInputText
                            id="address"
                            [(ngModel)]="branchForm.address"
                            placeholder="Enter address"
                            class="w-full" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideBranchDialog()" />
                <p-button
                    [label]="isEditMode ? 'Update' : 'Create'"
                    icon="pi pi-check"
                    (click)="saveBranch()" />
            </ng-template>
        </p-dialog>

        <!-- User Assignment Drawer -->
        <p-drawer
            [(visible)]="displayAssignDrawer"
            position="right"
            [style]="{ width: '500px' }"
            [modal]="true">
            <ng-template #header>
                <div class="flex flex-col gap-2" *ngIf="selectedBranch">
                    <h3 class="m-0">{{ selectedBranch.name }}</h3>
                    <div class="text-sm text-500">
                        <i class="pi pi-building mr-2"></i>{{ selectedBranch.companyName }}
                    </div>
                </div>
            </ng-template>

            <ng-template #content>
                <div class="flex flex-col gap-4" *ngIf="selectedBranch">
                    <!-- Assign New Users Section -->
                    <div class="border-1 surface-border border-round p-4">
                        <h4 class="mt-0 mb-3">Assign Users to Branch</h4>

                        <div class="mb-3">
                            <label class="block font-bold mb-2">Select Users</label>
                            <p-multiSelect
                                [(ngModel)]="selectedUserIds"
                                [options]="unassignedUsers"
                                optionLabel="username"
                                optionValue="id"
                                placeholder="Select users to assign"
                                [filter]="true"
                                filterPlaceholder="Search users..."
                                display="chip"
                                class="w-full">
                                <ng-template #item let-option>
                                    <div>
                                        <div class="font-bold">{{ option.username }}</div>
                                        <div class="text-sm text-500">{{ option.email }}</div>
                                        <p-tag
                                            *ngIf="option.roleName"
                                            [value]="option.roleName"
                                            severity="info"
                                            styleClass="text-xs mt-1" />
                                    </div>
                                </ng-template>
                            </p-multiSelect>
                        </div>

                        <p-button
                            label="Assign Selected Users"
                            icon="pi pi-check"
                            [disabled]="!selectedUserIds || selectedUserIds.length === 0"
                            (click)="assignUsers()"
                            styleClass="w-full" />
                    </div>

                    <!-- Currently Assigned Users Section -->
                    <div class="border-1 surface-border border-round p-4">
                        <h4 class="mt-0 mb-3">
                            Assigned Users
                            <p-tag
                                [value]="selectedBranch.employeeCount.toString()"
                                severity="success"
                                styleClass="ml-2" />
                        </h4>

                        <div *ngIf="selectedBranch.assignedUsers && selectedBranch.assignedUsers.length > 0" class="flex flex-col gap-2">
                            <div
                                *ngFor="let user of selectedBranch.assignedUsers"
                                class="flex items-center justify-between p-3 surface-50 border-round">
                                <div class="flex-1">
                                    <div class="font-bold">{{ user.username }}</div>
                                    <div class="text-sm text-500">{{ user.email }}</div>
                                    <div class="text-xs text-400 mt-1">
                                        Assigned: {{ user.assignedAt | date: 'short' }}
                                    </div>
                                </div>
                                <p-button
                                    icon="pi pi-times"
                                    [rounded]="true"
                                    [outlined]="true"
                                    severity="danger"
                                    size="small"
                                    (click)="unassignUser(user.userId)"
                                    pTooltip="Remove from branch" />
                            </div>
                        </div>

                        <div *ngIf="!selectedBranch.assignedUsers || selectedBranch.assignedUsers.length === 0" class="text-center text-500 py-4">
                            <i class="pi pi-users text-4xl mb-3"></i>
                            <p>No users assigned to this branch yet</p>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-drawer>
    `,
    styles: []
})
export class BranchManagementComponent implements OnInit, OnDestroy {
    companies: CompanyNavigation[] = [];
    branches: Branch[] = [];
    availableUsers: User[] = [];
    unassignedUsers: User[] = []; // Users not yet assigned to the current branch
    selectedCompanyId?: number;
    loading = false;
    displayBranchDialog = false;
    displayAssignDrawer = false;
    isEditMode = false;
    selectedBranch?: Branch;
    selectedUserIds: number[] = [];
    managerCompanyIds: number[] = [];
    private destroy$ = new Subject<void>();

    branchForm = {
        name: '',
        address: ''
    };

    constructor(
        private branchService: BranchService,
        private userService: UserService,
        private userAssignmentService: UserAssignmentService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        // Get manager's assigned companies
        this.userAssignmentService.navigation$
            .pipe(takeUntil(this.destroy$))
            .subscribe(navigation => {
                if (navigation) {
                    this.companies = navigation.navigation;
                    this.managerCompanyIds = navigation.navigation.map(c => c.companyId);

                    // Auto-select first company if available
                    if (this.companies.length > 0 && !this.selectedCompanyId) {
                        this.selectedCompanyId = this.companies[0].companyId;
                        this.loadBranches();
                    }

                    // Load users after we know the company IDs
                    this.loadUsers();
                }
            });

        // Load navigation if not already loaded
        const currentNav = this.userAssignmentService.getCurrentNavigation();
        if (!currentNav) {
            this.userAssignmentService.getMyNavigation().subscribe();
        } else {
            this.companies = currentNav.navigation;
            this.managerCompanyIds = currentNav.navigation.map(c => c.companyId);
            if (this.companies.length > 0 && !this.selectedCompanyId) {
                this.selectedCompanyId = this.companies[0].companyId;
                this.loadBranches();
            }
            this.loadUsers();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onCompanyChange() {
        this.loadBranches();
    }

    loadBranches() {
        if (!this.selectedCompanyId) return;

        this.loading = true;
        this.branchService.getBranchesByCompany(this.selectedCompanyId).subscribe({
            next: (branches) => {
                this.branches = branches;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load branches',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    loadUsers() {
        if (this.managerCompanyIds.length === 0) {
            return; // Wait for company IDs to load
        }

        this.userService.getAllUsers().subscribe({
            next: (users) => {
                // Filter to show only Employee role users from manager's company
                this.availableUsers = users.filter(u => {
                    const isEmployee = u.roleName === 'Employee';
                    const isActive = u.status === 'Active' || u.status === 'active';
                    const isFromManagerCompany = u.companyId && this.managerCompanyIds.includes(u.companyId);
                    return isEmployee && isActive && isFromManagerCompany;
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users',
                    life: 3000
                });
            }
        });
    }

    showCreateDialog() {
        this.isEditMode = false;
        this.branchForm = {
            name: '',
            address: ''
        };
        this.displayBranchDialog = true;
    }

    showEditDialog(branch: Branch) {
        this.isEditMode = true;
        this.selectedBranch = branch;
        this.branchForm = {
            name: branch.name,
            address: branch.address || ''
        };
        this.displayBranchDialog = true;
    }

    hideBranchDialog() {
        this.displayBranchDialog = false;
        this.selectedBranch = undefined;
    }

    saveBranch() {
        if (!this.branchForm.name) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Branch name is required',
                life: 3000
            });
            return;
        }

        if (this.isEditMode && this.selectedBranch) {
            const request: UpdateBranchRequest = {
                name: this.branchForm.name,
                address: this.branchForm.address
            };

            this.branchService.updateBranch(this.selectedBranch.id, request).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Branch updated successfully',
                        life: 3000
                    });
                    this.loadBranches();
                    this.hideBranchDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update branch',
                        life: 3000
                    });
                }
            });
        } else if (this.selectedCompanyId) {
            const request: CreateBranchRequest = {
                companyId: this.selectedCompanyId,
                name: this.branchForm.name,
                address: this.branchForm.address
            };

            this.branchService.createBranch(request).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Branch created successfully',
                        life: 3000
                    });
                    this.loadBranches();
                    this.hideBranchDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to create branch',
                        life: 3000
                    });
                }
            });
        }
    }

    deleteBranch(branch: Branch) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete branch "${branch.name}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.branchService.deleteBranch(branch.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Branch deleted successfully',
                            life: 3000
                        });
                        this.loadBranches();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete branch',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    showAssignDrawer(branch: Branch) {
        // Load full branch details with assigned users
        this.branchService.getBranch(branch.id).subscribe({
            next: (fullBranch) => {
                this.selectedBranch = fullBranch;
                this.selectedUserIds = [];

                // Filter out users already assigned to this branch
                const assignedUserIds = fullBranch.assignedUsers?.map(u => u.userId) || [];
                this.unassignedUsers = this.availableUsers.filter(u => !assignedUserIds.includes(u.id));

                this.displayAssignDrawer = true;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load branch details',
                    life: 3000
                });
            }
        });
    }

    assignUsers() {
        if (!this.selectedBranch || !this.selectedUserIds || this.selectedUserIds.length === 0) return;

        let successCount = 0;
        let errorCount = 0;
        const totalUsers = this.selectedUserIds.length;

        this.selectedUserIds.forEach((userId, index) => {
            const request: AssignUserToBranchRequest = { userId };

            this.branchService.assignUserToBranch(this.selectedBranch!.id, request).subscribe({
                next: () => {
                    successCount++;
                    if (successCount + errorCount === totalUsers) {
                        this.showAssignmentResults(successCount, errorCount);
                    }
                },
                error: (error) => {
                    errorCount++;
                    if (successCount + errorCount === totalUsers) {
                        this.showAssignmentResults(successCount, errorCount);
                    }
                }
            });
        });
    }

    showAssignmentResults(successCount: number, errorCount: number) {
        if (errorCount === 0) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${successCount} user(s) assigned successfully`,
                life: 3000
            });
        } else if (successCount === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to assign users',
                life: 3000
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Partial Success',
                detail: `${successCount} succeeded, ${errorCount} failed`,
                life: 3000
            });
        }

        this.selectedUserIds = [];
        this.loadBranches();

        // Reload branch details in drawer
        if (this.selectedBranch) {
            this.showAssignDrawer(this.selectedBranch);
        }
    }

    unassignUser(userId: number) {
        if (!this.selectedBranch) return;

        this.confirmationService.confirm({
            message: 'Are you sure you want to remove this user from the branch?',
            header: 'Unassign Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.branchService.unassignUserFromBranch(this.selectedBranch!.id, userId).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User unassigned successfully',
                            life: 3000
                        });
                        this.loadBranches();

                        // Reload branch details in drawer
                        if (this.selectedBranch) {
                            this.showAssignDrawer(this.selectedBranch);
                        }
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to unassign user',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}
