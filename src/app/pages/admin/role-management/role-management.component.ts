import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Role, CreateRoleRequest } from '../../service/role.service';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-role-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        ToastModule,
        ConfirmDialog,
        TagModule,
        CardModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Role Management</h5>
                    <p-toast></p-toast>
                    <p-confirmDialog></p-confirmDialog>

                    <p-button
                        label="Create New Role"
                        icon="pi pi-plus"
                        (onClick)="showCreateDialog()"
                        styleClass="mb-3">
                    </p-button>

                    <p-table
                        [value]="roles"
                        [loading]="loading"
                        responsiveLayout="scroll"
                        styleClass="p-datatable-gridlines">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>ID</th>
                                <th>Role Name</th>
                                <th>Description</th>
                                <th>Permissions</th>
                                <th>Users</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-role>
                            <tr>
                                <td>{{ role.id }}</td>
                                <td>
                                    <span class="font-bold">{{ role.name }}</span>
                                </td>
                                <td>{{ role.description || 'N/A' }}</td>
                                <td>
                                    <p-tag
                                        *ngFor="let permission of role.permissions.slice(0, 3)"
                                        [value]="permission"
                                        severity="info"
                                        styleClass="mr-1 mb-1">
                                    </p-tag>
                                    <span *ngIf="role.permissions.length > 3" class="text-sm text-500">
                                        +{{ role.permissions.length - 3 }} more
                                    </span>
                                </td>
                                <td>{{ role.userCount }}</td>
                                <td>{{ role.createdAt | date: 'short' }}</td>
                                <td>
                                    <p-button
                                        icon="pi pi-pencil"
                                        styleClass="p-button-rounded p-button-text p-button-warning mr-2"
                                        (onClick)="showEditDialog(role)"
                                        pTooltip="Edit">
                                    </p-button>
                                    <p-button
                                        icon="pi pi-trash"
                                        styleClass="p-button-rounded p-button-text p-button-danger"
                                        (onClick)="confirmDelete(role)"
                                        pTooltip="Delete"
                                        [disabled]="role.userCount > 0">
                                    </p-button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="text-center">No roles found. Create your first role!</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <!-- Create/Edit Role Dialog -->
        <p-dialog
            [(visible)]="displayDialog"
            [header]="editMode ? 'Edit Role' : 'Create New Role'"
            [modal]="true"
            [style]="{width: '600px'}"
            [closable]="true">
            <div class="p-fluid">
                <div class="field mb-4">
                    <label for="name">Role Name *</label>
                    <input
                        pInputText
                        id="name"
                        [(ngModel)]="roleForm.name"
                        placeholder="e.g. Manager, Sales, Viewer"
                        required />
                </div>

                <div class="field mb-4">
                    <label for="description">Description</label>
                    <textarea
                        pTextarea
                        id="description"
                        [(ngModel)]="roleForm.description"
                        rows="3"
                        placeholder="Describe this role's purpose">
                    </textarea>
                </div>

                <div class="field mb-4">
                    <label for="permissions">Permissions *</label>
                    <textarea
                        pTextarea
                        id="permissions"
                        [(ngModel)]="permissionsText"
                        rows="4"
                        placeholder="Enter permissions (one per line or comma-separated)&#10;Examples:&#10;users.view&#10;users.manage&#10;reports.view, sales.edit">
                    </textarea>
                    <small class="text-500 block mt-2">
                        Enter one permission per line or separate with commas
                    </small>
                </div>

                <div class="field" *ngIf="parsedPermissions.length > 0">
                    <label>Current Permissions:</label>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <p-tag
                            *ngFor="let perm of parsedPermissions"
                            [value]="perm"
                            severity="success"
                            styleClass="mr-1 mb-1">
                        </p-tag>
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    (onClick)="hideDialog()"
                    styleClass="p-button-text">
                </p-button>
                <p-button
                    [label]="editMode ? 'Update' : 'Create'"
                    icon="pi pi-check"
                    (onClick)="saveRole()"
                    [disabled]="!roleForm.name || parsedPermissions.length === 0">
                </p-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        :host ::ng-deep {
            .p-tag {
                font-size: 0.75rem;
            }
        }
    `]
})
export class RoleManagementComponent implements OnInit {
    roles: Role[] = [];
    loading = false;
    displayDialog = false;
    editMode = false;
    selectedRoleId?: number;
    permissionsText: string = '';

    roleForm: CreateRoleRequest = {
        name: '',
        description: '',
        permissions: []
    };

    get parsedPermissions(): string[] {
        if (!this.permissionsText.trim()) return [];

        // Split by newlines and commas, trim each, and filter empty strings
        return this.permissionsText
            .split(/[\n,]+/)
            .map(p => p.trim())
            .filter(p => p.length > 0);
    }

    constructor(
        private roleService: RoleService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.loading = true;
        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles = roles;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load roles'
                });
                this.loading = false;
            }
        });
    }

    showCreateDialog() {
        this.editMode = false;
        this.roleForm = {
            name: '',
            description: '',
            permissions: []
        };
        this.permissionsText = '';
        this.displayDialog = true;
    }

    showEditDialog(role: Role) {
        this.editMode = true;
        this.selectedRoleId = role.id;
        this.roleForm = {
            name: role.name,
            description: role.description,
            permissions: [...role.permissions]
        };
        this.permissionsText = role.permissions.join('\n');
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
    }

    saveRole() {
        // Update permissions from parsed text
        this.roleForm.permissions = this.parsedPermissions;

        if (this.editMode && this.selectedRoleId) {
            this.roleService.updateRole(this.selectedRoleId, this.roleForm).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Role updated successfully'
                    });
                    this.loadRoles();
                    this.hideDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update role'
                    });
                }
            });
        } else {
            this.roleService.createRole(this.roleForm).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Role created successfully'
                    });
                    this.loadRoles();
                    this.hideDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to create role'
                    });
                }
            });
        }
    }

    confirmDelete(role: Role) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the role "${role.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteRole(role.id);
            }
        });
    }

    deleteRole(id: number) {
        this.roleService.deleteRole(id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Role deleted successfully'
                });
                this.loadRoles();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to delete role'
                });
            }
        });
    }
}
