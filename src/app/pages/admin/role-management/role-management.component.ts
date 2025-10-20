import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Role, CreateRoleRequest } from '../../service/role.service';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

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
        ToolbarModule,
        ConfirmDialogModule,
        TagModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '450px' }" />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button
                    label="New Role"
                    icon="pi pi-plus"
                    severity="secondary"
                    (onClick)="showCreateDialog()" />
            </ng-template>
        </p-toolbar>

        <p-table
            [value]="roles"
            [loading]="loading"
            [tableStyle]="{ 'min-width': '50rem' }"
            [rowHover]="true"
            dataKey="id">
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Roles</h5>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="min-width: 4rem">ID</th>
                    <th style="min-width: 12rem">Role Name</th>
                    <th style="min-width: 16rem">Description</th>
                    <th style="min-width: 6rem">Users</th>
                    <th style="min-width: 12rem">Created</th>
                    <th style="min-width: 10rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-role>
                <tr>
                    <td>{{ role.id }}</td>
                    <td><span class="font-bold">{{ role.name }}</span></td>
                    <td>{{ role.description || 'N/A' }}</td>
                    <td>{{ role.userCount }}</td>
                    <td>{{ role.createdAt | date: 'short' }}</td>
                    <td>
                        <p-button
                            icon="pi pi-pencil"
                            class="mr-2"
                            [rounded]="true"
                            [outlined]="true"
                            severity="warn"
                            (click)="showEditDialog(role)" />
                        <p-button
                            icon="pi pi-trash"
                            severity="danger"
                            [rounded]="true"
                            [outlined]="true"
                            (click)="confirmDelete(role)"
                            [disabled]="role.userCount > 0" />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="6" class="text-center">No roles found. Create your first role!</td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Create/Edit Role Dialog -->
        <p-dialog
            [(visible)]="displayDialog"
            [header]="editMode ? 'Edit Role' : 'Create New Role'"
            [modal]="true"
            [style]="{ width: '450px' }">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Role Name *</label>
                        <input
                            type="text"
                            pInputText
                            id="name"
                            [(ngModel)]="roleForm.name"
                            placeholder="e.g. Manager, Employee, Viewer"
                            required
                            fluid />
                        <small class="text-red-500" *ngIf="submitted && !roleForm.name">Role name is required.</small>
                    </div>

                    <div>
                        <label for="description" class="block font-bold mb-3">Description</label>
                        <textarea
                            pTextarea
                            id="description"
                            [(ngModel)]="roleForm.description"
                            rows="3"
                            placeholder="Describe this role's purpose"
                            fluid></textarea>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideDialog()" />
                <p-button
                    [label]="editMode ? 'Update' : 'Create'"
                    icon="pi pi-check"
                    (click)="saveRole()" />
            </ng-template>
        </p-dialog>
    `,
    styles: []
})
export class RoleManagementComponent implements OnInit {
    roles: Role[] = [];
    loading = false;
    displayDialog = false;
    editMode = false;
    selectedRoleId?: number;
    submitted = false;

    roleForm: CreateRoleRequest = {
        name: '',
        description: ''
    };

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
                    detail: 'Failed to load roles',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    showCreateDialog() {
        this.editMode = false;
        this.submitted = false;
        this.roleForm = {
            name: '',
            description: ''
        };
        this.displayDialog = true;
    }

    showEditDialog(role: Role) {
        this.editMode = true;
        this.submitted = false;
        this.selectedRoleId = role.id;
        this.roleForm = {
            name: role.name,
            description: role.description
        };
        this.displayDialog = true;
    }

    hideDialog() {
        this.displayDialog = false;
        this.submitted = false;
    }

    saveRole() {
        this.submitted = true;

        if (!this.roleForm.name?.trim()) {
            return;
        }

        if (this.editMode && this.selectedRoleId) {
            this.roleService.updateRole(this.selectedRoleId, this.roleForm).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Role updated successfully',
                        life: 3000
                    });
                    this.loadRoles();
                    this.hideDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update role',
                        life: 3000
                    });
                }
            });
        } else {
            this.roleService.createRole(this.roleForm).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Role created successfully',
                        life: 3000
                    });
                    this.loadRoles();
                    this.hideDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to create role',
                        life: 3000
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
                    summary: 'Successful',
                    detail: 'Role deleted successfully',
                    life: 3000
                });
                this.loadRoles();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to delete role',
                    life: 3000
                });
            }
        });
    }
}
