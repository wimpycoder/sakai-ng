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
import { ToolbarModule } from 'primeng/toolbar';
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
        ToolbarModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <h5 class="m-0">User Management</h5>
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
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Users</h5>
                </div>
            </ng-template>
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
                            severity="success" />
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

        <!-- Assign Role Dialog -->
        <p-dialog
            [(visible)]="displayAssignDialog"
            header="Assign Role to User"
            [modal]="true"
            [style]="{ width: '450px', maxHeight: '90vh' }"
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
                            fluid>
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
                    detail: 'Failed to load roles',
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
