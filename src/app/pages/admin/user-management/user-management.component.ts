import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../service/user.service';
import { RoleService, Role, AssignRoleRequest } from '../../service/role.service';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-user-management',
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
        CardModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>User Management</h5>
                    <p>Manage user roles and status</p>
                    <p-toast></p-toast>

                    <p-table
                        [value]="users"
                        [loading]="loading"
                        responsiveLayout="scroll"
                        styleClass="p-datatable-gridlines"
                        [paginator]="true"
                        [rows]="10">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-user>
                            <tr>
                                <td>{{ user.id }}</td>
                                <td>
                                    <span class="font-bold">{{ user.username }}</span>
                                </td>
                                <td>{{ user.email }}</td>
                                <td>
                                    <p-tag
                                        *ngIf="user.roleName"
                                        [value]="user.roleName"
                                        severity="success">
                                    </p-tag>
                                    <span *ngIf="!user.roleName" class="text-500">No Role</span>
                                </td>
                                <td>
                                    <p-tag
                                        [value]="user.status"
                                        [severity]="user.status === 'Active' ? 'success' : 'danger'">
                                    </p-tag>
                                </td>
                                <td>{{ user.createdAt | date: 'short' }}</td>
                                <td>
                                    <p-button
                                        icon="pi pi-user-edit"
                                        label="Assign Role"
                                        styleClass="p-button-sm p-button-text p-button-info mr-2"
                                        (onClick)="showAssignRoleDialog(user)"
                                        pTooltip="Assign or change role">
                                    </p-button>
                                    <p-button
                                        *ngIf="user.status === 'Active'"
                                        icon="pi pi-ban"
                                        styleClass="p-button-sm p-button-text p-button-warning mr-2"
                                        (onClick)="deactivateUser(user)"
                                        pTooltip="Deactivate">
                                    </p-button>
                                    <p-button
                                        *ngIf="user.status === 'Inactive'"
                                        icon="pi pi-check"
                                        styleClass="p-button-sm p-button-text p-button-success"
                                        (onClick)="activateUser(user)"
                                        pTooltip="Activate">
                                    </p-button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="text-center">No users found</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <!-- Assign Role Dialog -->
        <p-dialog
            [(visible)]="displayAssignDialog"
            header="Assign Role to User"
            [modal]="true"
            [style]="{width: '450px'}"
            [closable]="true">
            <div class="p-fluid" *ngIf="selectedUser">
                <div class="field mb-4">
                    <label class="font-bold">User:</label>
                    <div class="text-lg">{{ selectedUser.username }}</div>
                    <div class="text-sm text-500">{{ selectedUser.email }}</div>
                </div>

                <div class="field mb-4" *ngIf="selectedUser.roleName">
                    <label class="font-bold">Current Role:</label>
                    <div>
                        <p-tag [value]="selectedUser.roleName" severity="info"></p-tag>
                    </div>
                </div>

                <div class="field">
                    <label for="role">Select New Role</label>
                    <p-select
                        [(ngModel)]="selectedRoleId"
                        [options]="roleOptions"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select a role"
                        [showClear]="true"
                        styleClass="w-full">
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

            <ng-template pTemplate="footer">
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    (onClick)="hideAssignDialog()"
                    styleClass="p-button-text">
                </p-button>
                <p-button
                    *ngIf="selectedRoleId"
                    label="Assign Role"
                    icon="pi pi-check"
                    (onClick)="assignRole()">
                </p-button>
                <p-button
                    *ngIf="!selectedRoleId && selectedUser?.roleId"
                    label="Remove Role"
                    icon="pi pi-trash"
                    (onClick)="unassignRole()"
                    styleClass="p-button-warning">
                </p-button>
            </ng-template>
        </p-dialog>
    `,
    styles: []
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    roles: Role[] = [];
    roleOptions: { id: number; name: string; description?: string }[] = [];
    loading = false;
    displayAssignDialog = false;
    selectedUser?: User;
    selectedRoleId?: number;

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers() {
        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load users'
                });
                this.loading = false;
            }
        });
    }

    loadRoles() {
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
                this.roleOptions = roles.map(r => ({
                    id: r.id,
                    name: r.name,
                    description: r.description
                }));
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load roles'
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
                    summary: 'Success',
                    detail: 'Role assigned successfully'
                });
                this.loadUsers();
                this.hideAssignDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to assign role'
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
                    summary: 'Success',
                    detail: 'Role removed successfully'
                });
                this.loadUsers();
                this.hideAssignDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to remove role'
                });
            }
        });
    }

    activateUser(user: User) {
        this.userService.activateUser(user.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User ${user.username} activated successfully`
                });
                this.loadUsers();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to activate user'
                });
            }
        });
    }

    deactivateUser(user: User) {
        this.userService.deactivateUser(user.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `User ${user.username} deactivated successfully`
                });
                this.loadUsers();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to deactivate user'
                });
            }
        });
    }
}
