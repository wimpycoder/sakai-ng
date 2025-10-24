import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService, User } from '../service/user.service';
import { RoleService, Role, AssignRoleRequest } from '../service/role.service';
import { AuthService, RegisterRequest } from '../service/auth.service';
import { UserAssignmentService } from '../service/user-assignment.service';
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
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-manager-user-management',
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
        PasswordModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <h5 class="m-0">User Management</h5>
            </ng-template>
            <ng-template #end>
                <p-button
                    label="Create User"
                    icon="pi pi-plus"
                    (click)="showCreateUserDialog()" />
            </ng-template>
        </p-toolbar>

        <p-table
            [value]="users"
            [loading]="loading"
            [tableStyle]="{ 'min-width': '60rem' }"
            [rowHover]="true"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 20, 30]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            dataKey="id">
            <ng-template #header>
                <tr>
                    <th style="min-width: 4rem">ID</th>
                    <th style="min-width: 12rem">Username</th>
                    <th style="min-width: 14rem">Email</th>
                    <th style="min-width: 10rem">Role</th>
                    <th style="min-width: 8rem">Status</th>
                    <th style="min-width: 12rem">Created</th>
                    <th style="min-width: 14rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-user>
                <tr>
                    <td>{{ user.id }}</td>
                    <td><span class="font-bold">{{ user.username }}</span></td>
                    <td>{{ user.email }}</td>
                    <td>
                        <p-tag
                            *ngIf="user.roleName"
                            [value]="user.roleName"
                            [severity]="user.roleName === 'Manager' ? 'info' : user.roleName === 'Employee' ? 'success' : 'warn'" />
                        <span *ngIf="!user.roleName" class="text-500">No Role</span>
                    </td>
                    <td>
                        <p-tag
                            [value]="user.status"
                            [severity]="user.status === 'Active' ? 'success' : 'danger'" />
                    </td>
                    <td>{{ user.createdAt | date: 'short' }}</td>
                    <td>
                        <p-button
                            icon="pi pi-user-edit"
                            label="Role"
                            class="mr-2"
                            [rounded]="true"
                            [outlined]="true"
                            severity="info"
                            (click)="showAssignRoleDialog(user)"
                            pTooltip="Assign or change role" />
                        <p-button
                            *ngIf="user.status === 'Active'"
                            icon="pi pi-ban"
                            [rounded]="true"
                            [outlined]="true"
                            severity="warn"
                            (click)="deactivateUser(user)"
                            pTooltip="Deactivate" />
                        <p-button
                            *ngIf="user.status === 'Inactive'"
                            icon="pi pi-check"
                            [rounded]="true"
                            [outlined]="true"
                            severity="success"
                            (click)="activateUser(user)"
                            pTooltip="Activate" />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="7" class="text-center">No users found</td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Create User Dialog -->
        <p-dialog
            [(visible)]="displayCreateDialog"
            header="Create New User"
            [modal]="true"
            [style]="{ width: '500px' }">
            <ng-template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="username" class="block font-bold mb-2">Username *</label>
                        <input
                            pInputText
                            id="username"
                            [(ngModel)]="createForm.username"
                            placeholder="Enter username"
                            class="w-full" />
                    </div>

                    <div>
                        <label for="email" class="block font-bold mb-2">Email *</label>
                        <input
                            pInputText
                            id="email"
                            type="email"
                            [(ngModel)]="createForm.email"
                            placeholder="Enter email"
                            class="w-full" />
                    </div>

                    <div>
                        <label for="password" class="block font-bold mb-2">Password *</label>
                        <p-password
                            [(ngModel)]="createForm.password"
                            [toggleMask]="true"
                            [feedback]="true"
                            placeholder="Enter password"
                            styleClass="w-full"
                            [inputStyle]="{'width': '100%'}" />
                    </div>

                    <div>
                        <label for="role" class="block font-bold mb-2">Assign Role</label>
                        <p-select
                            [(ngModel)]="createForm.roleId"
                            [options]="roleOptions"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select a role (optional)"
                            [showClear]="true"
                            [appendTo]="'body'"
                            class="w-full">
                            <ng-template #item let-option>
                                <div>
                                    <div class="font-bold">{{ option.name }}</div>
                                    <div class="text-sm text-500">{{ option.description }}</div>
                                </div>
                            </ng-template>
                        </p-select>
                        <small class="text-500 block mt-2">
                            You can assign a role later if needed
                        </small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideCreateDialog()" />
                <p-button
                    label="Create User"
                    icon="pi pi-check"
                    (click)="createUser()" />
            </ng-template>
        </p-dialog>

        <!-- Assign Role Dialog -->
        <p-dialog
            [(visible)]="displayAssignDialog"
            header="Assign Role to User"
            [modal]="true"
            [style]="{ width: '450px' }"
            [contentStyle]="{ overflow: 'visible' }">
            <ng-template #content>
                <div class="flex flex-col gap-6" *ngIf="selectedUser">
                    <div>
                        <label class="block font-bold mb-2">User:</label>
                        <div class="text-lg">{{ selectedUser.username }}</div>
                        <div class="text-sm text-500">{{ selectedUser.email }}</div>
                    </div>

                    <div *ngIf="selectedUser.roleName">
                        <label class="block font-bold mb-2">Current Role:</label>
                        <p-tag [value]="selectedUser.roleName" severity="info" />
                    </div>

                    <div>
                        <label for="role" class="block font-bold mb-3">Select New Role</label>
                        <p-select
                            [(ngModel)]="selectedRoleId"
                            [options]="roleOptions"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select a role"
                            [showClear]="true"
                            [appendTo]="'body'"
                            [filter]="true"
                            filterPlaceholder="Search roles..."
                            class="w-full">
                            <ng-template #selecteditem let-option>
                                <div *ngIf="option">
                                    <div class="font-bold">{{ option.name }}</div>
                                    <div class="text-sm text-500">{{ option.description }}</div>
                                </div>
                            </ng-template>
                            <ng-template #item let-option>
                                <div>
                                    <div class="font-bold">{{ option.name }}</div>
                                    <div class="text-sm text-500">{{ option.description }}</div>
                                </div>
                            </ng-template>
                        </p-select>
                        <small class="text-500 mt-2 block">
                            Leave empty to remove role from user
                        </small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideAssignDialog()" />
                <p-button
                    *ngIf="selectedRoleId"
                    label="Assign Role"
                    icon="pi pi-check"
                    (click)="assignRole()" />
                <p-button
                    *ngIf="!selectedRoleId && selectedUser?.roleId"
                    label="Remove Role"
                    icon="pi pi-trash"
                    severity="warn"
                    (click)="unassignRole()" />
            </ng-template>
        </p-dialog>
    `,
    styles: []
})
export class ManagerUserManagementComponent implements OnInit, OnDestroy {
    users: User[] = [];
    allUsers: User[] = [];
    roles: Role[] = [];
    roleOptions: { id: number; name: string; description?: string }[] = [];
    loading = false;
    displayCreateDialog = false;
    displayAssignDialog = false;
    selectedUser?: User;
    selectedRoleId?: number;
    managerCompanyIds: number[] = [];
    private destroy$ = new Subject<void>();

    createForm = {
        username: '',
        email: '',
        password: '',
        roleId: null as number | null
    };

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private authService: AuthService,
        private userAssignmentService: UserAssignmentService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Get manager's assigned companies first
        this.userAssignmentService.navigation$
            .pipe(takeUntil(this.destroy$))
            .subscribe(navigation => {
                if (navigation) {
                    this.managerCompanyIds = navigation.navigation.map(c => c.companyId);
                    this.loadUsers();
                }
            });

        // Load navigation if not already loaded
        const currentNav = this.userAssignmentService.getCurrentNavigation();
        if (!currentNav) {
            this.userAssignmentService.getMyNavigation().subscribe();
        } else {
            this.managerCompanyIds = currentNav.navigation.map(c => c.companyId);
            this.loadUsers();
        }

        this.loadRoles();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadUsers() {
        if (this.managerCompanyIds.length === 0) {
            return; // Wait for company IDs to load
        }

        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.allUsers = users;
                // Filter users: only show users from manager's companies or users without company
                this.users = users.filter(u =>
                    u.companyId && this.managerCompanyIds.includes(u.companyId)
                );
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    loadRoles() {
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
                // Filter out Admin role for managers
                this.roleOptions = roles
                    .filter(r => r.name !== 'Admin')
                    .map(r => ({
                        id: r.id,
                        name: r.name,
                        description: r.description
                    }));
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load roles',
                    life: 3000
                });
            }
        });
    }

    showCreateUserDialog() {
        this.createForm = {
            username: '',
            email: '',
            password: '',
            roleId: null
        };
        this.displayCreateDialog = true;
    }

    hideCreateDialog() {
        this.displayCreateDialog = false;
    }

    createUser() {
        if (!this.createForm.username || !this.createForm.email || !this.createForm.password) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in all required fields',
                life: 3000
            });
            return;
        }

        if (this.managerCompanyIds.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No company assigned. Please contact administrator.',
                life: 3000
            });
            return;
        }

        // Use the first company if manager has multiple companies
        const companyId = this.managerCompanyIds[0];

        const registerRequest: RegisterRequest = {
            username: this.createForm.username,
            email: this.createForm.email,
            password: this.createForm.password,
            companyId: companyId
        };

        this.authService.register(registerRequest).subscribe({
            next: (response) => {
                // If role is selected, assign it
                if (this.createForm.roleId && response.userId) {
                    const assignRequest: AssignRoleRequest = {
                        userId: response.userId,
                        roleId: this.createForm.roleId
                    };

                    this.roleService.assignRole(assignRequest).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User created and role assigned successfully',
                                life: 3000
                            });
                            this.loadUsers();
                            this.hideCreateDialog();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Partial Success',
                                detail: 'User created but failed to assign role',
                                life: 3000
                            });
                            this.loadUsers();
                            this.hideCreateDialog();
                        }
                    });
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully',
                        life: 3000
                    });
                    this.loadUsers();
                    this.hideCreateDialog();
                }
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to create user',
                    life: 3000
                });
            }
        });
    }

    showAssignRoleDialog(user: User) {
        this.selectedUser = user;
        this.selectedRoleId = user.roleId;
        this.displayAssignDialog = true;
    }

    hideAssignDialog() {
        this.displayAssignDialog = false;
        this.selectedUser = undefined;
        this.selectedRoleId = undefined;
    }

    assignRole() {
        if (!this.selectedUser || !this.selectedRoleId) return;

        const request: AssignRoleRequest = {
            userId: this.selectedUser.id,
            roleId: this.selectedRoleId
        };

        this.roleService.assignRole(request).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Role assigned successfully',
                    life: 3000
                });
                this.loadUsers();
                this.hideAssignDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to assign role',
                    life: 3000
                });
            }
        });
    }

    unassignRole() {
        if (!this.selectedUser) return;

        this.roleService.unassignRole(this.selectedUser.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Role removed successfully',
                    life: 3000
                });
                this.loadUsers();
                this.hideAssignDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to remove role',
                    life: 3000
                });
            }
        });
    }

    activateUser(user: User) {
        this.userService.activateUser(user.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: `User ${user.username} activated successfully`,
                    life: 3000
                });
                this.loadUsers();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to activate user',
                    life: 3000
                });
            }
        });
    }

    deactivateUser(user: User) {
        this.userService.deactivateUser(user.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: `User ${user.username} deactivated successfully`,
                    life: 3000
                });
                this.loadUsers();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to deactivate user',
                    life: 3000
                });
            }
        });
    }
}
