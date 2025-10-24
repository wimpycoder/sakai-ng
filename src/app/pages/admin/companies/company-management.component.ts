import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../service/company.service';
import { UserService, User } from '../../service/user.service';
import { Company, CreateCompanyRequest, UpdateCompanyRequest, AssignManagerRequest } from '../../../models/company.model';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-company-management',
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
        InputNumberModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <h5 class="m-0">Company Management</h5>
            </ng-template>
            <ng-template #end>
                <p-button
                    label="New Company"
                    icon="pi pi-plus"
                    (click)="showCreateDialog()" />
            </ng-template>
        </p-toolbar>

        <p-table
            [value]="companies"
            [loading]="loading"
            [tableStyle]="{ 'min-width': '70rem' }"
            [rowHover]="true"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 20, 30]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} companies"
            dataKey="id">
            <ng-template #header>
                <tr>
                    <th style="min-width: 4rem">ID</th>
                    <th style="min-width: 12rem">Name</th>
                    <th style="min-width: 18rem">Description</th>
                    <th style="min-width: 8rem">Branches</th>
                    <th style="min-width: 14rem">Managers</th>
                    <th style="min-width: 10rem">Created By</th>
                    <th style="min-width: 14rem">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-company>
                <tr>
                    <td>{{ company.id }}</td>
                    <td><span class="font-bold">{{ company.name }}</span></td>
                    <td>{{ company.description || 'N/A' }}</td>
                    <td>
                        <p-tag
                            [value]="company.currentBranchCount + ' / ' + company.maxBranches"
                            [severity]="company.currentBranchCount >= company.maxBranches ? 'danger' : 'success'" />
                    </td>
                    <td>
                        <div class="flex flex-wrap gap-1">
                            <p-tag
                                *ngFor="let manager of company.managers"
                                [value]="manager.username"
                                severity="info"
                                [pTooltip]="manager.email" />
                        </div>
                    </td>
                    <td>{{ company.createdByUsername }}</td>
                    <td>
                        <p-button
                            icon="pi pi-pencil"
                            [rounded]="true"
                            [outlined]="true"
                            severity="info"
                            class="mr-2"
                            (click)="showEditDialog(company)"
                            pTooltip="Edit" />
                        <p-button
                            icon="pi pi-user-plus"
                            [rounded]="true"
                            [outlined]="true"
                            severity="success"
                            class="mr-2"
                            (click)="showAssignManagerDialog(company)"
                            pTooltip="Assign Manager" />
                        <p-button
                            icon="pi pi-trash"
                            [rounded]="true"
                            [outlined]="true"
                            severity="danger"
                            (click)="deleteCompany(company)"
                            pTooltip="Delete" />
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="7" class="text-center">No companies found</td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Create/Edit Company Dialog -->
        <p-dialog
            [(visible)]="displayCompanyDialog"
            [header]="isEditMode ? 'Edit Company' : 'Create New Company'"
            [modal]="true"
            [style]="{ width: '500px' }">
            <ng-template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="name" class="block font-bold mb-2">Company Name *</label>
                        <input
                            pInputText
                            id="name"
                            [(ngModel)]="companyForm.name"
                            placeholder="Enter company name"
                            class="w-full" />
                    </div>

                    <div>
                        <label for="description" class="block font-bold mb-2">Description</label>
                        <input
                            pInputText
                            id="description"
                            [(ngModel)]="companyForm.description"
                            placeholder="Enter description"
                            class="w-full" />
                    </div>

                    <div>
                        <label for="maxBranches" class="block font-bold mb-2">Max Branches *</label>
                        <p-inputNumber
                            [(ngModel)]="companyForm.maxBranches"
                            [min]="1"
                            [max]="100"
                            [showButtons]="true"
                            inputId="maxBranches"
                            class="w-full" />
                    </div>

                    <div *ngIf="!isEditMode">
                        <label for="manager" class="block font-bold mb-2">Assign Manager *</label>
                        <p-select
                            [(ngModel)]="companyForm.managerUserId"
                            [options]="managerUsers"
                            optionLabel="username"
                            optionValue="id"
                            placeholder="Select a manager"
                            [filter]="true"
                            filterPlaceholder="Search managers..."
                            [appendTo]="'body'"
                            class="w-full">
                            <ng-template #item let-option>
                                <div>
                                    <div class="font-bold">{{ option.username }}</div>
                                    <div class="text-sm text-500">{{ option.email }}</div>
                                </div>
                            </ng-template>
                        </p-select>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideCompanyDialog()" />
                <p-button
                    [label]="isEditMode ? 'Update' : 'Create'"
                    icon="pi pi-check"
                    (click)="saveCompany()" />
            </ng-template>
        </p-dialog>

        <!-- Assign Manager Dialog -->
        <p-dialog
            [(visible)]="displayAssignManagerDialog"
            header="Assign Manager to Company"
            [modal]="true"
            [style]="{ width: '450px' }">
            <ng-template #content>
                <div class="flex flex-col gap-4" *ngIf="selectedCompany">
                    <div>
                        <label class="block font-bold mb-2">Company:</label>
                        <div class="text-lg">{{ selectedCompany.name }}</div>
                    </div>

                    <div *ngIf="selectedCompany.managers.length > 0">
                        <label class="block font-bold mb-2">Current Managers:</label>
                        <div class="flex flex-wrap gap-2">
                            <p-tag
                                *ngFor="let manager of selectedCompany.managers"
                                [value]="manager.username"
                                severity="info">
                                <span class="flex items-center gap-2">
                                    {{ manager.username }}
                                    <i class="pi pi-times cursor-pointer"
                                       (click)="unassignManager(selectedCompany.id, manager.userId)"
                                       pTooltip="Remove"></i>
                                </span>
                            </p-tag>
                        </div>
                    </div>

                    <div>
                        <label for="newManager" class="block font-bold mb-2">Assign New Manager</label>
                        <p-select
                            [(ngModel)]="selectedManagerId"
                            [options]="managerUsers"
                            optionLabel="username"
                            optionValue="id"
                            placeholder="Select a manager"
                            [filter]="true"
                            filterPlaceholder="Search managers..."
                            [appendTo]="'body'"
                            class="w-full">
                            <ng-template #item let-option>
                                <div>
                                    <div class="font-bold">{{ option.username }}</div>
                                    <div class="text-sm text-500">{{ option.email }}</div>
                                </div>
                            </ng-template>
                        </p-select>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    label="Cancel"
                    icon="pi pi-times"
                    text
                    (click)="hideAssignManagerDialog()" />
                <p-button
                    label="Assign"
                    icon="pi pi-check"
                    [disabled]="!selectedManagerId"
                    (click)="assignManager()" />
            </ng-template>
        </p-dialog>
    `,
    styles: []
})
export class CompanyManagementComponent implements OnInit {
    companies: Company[] = [];
    managerUsers: User[] = [];
    loading = false;
    displayCompanyDialog = false;
    displayAssignManagerDialog = false;
    isEditMode = false;
    selectedCompany?: Company;
    selectedManagerId?: number;

    companyForm: any = {
        name: '',
        description: '',
        maxBranches: 1,
        managerUserId: null
    };

    constructor(
        private companyService: CompanyService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadCompanies();
        this.loadManagerUsers();
    }

    loadCompanies() {
        this.loading = true;
        this.companyService.getAllCompanies().subscribe({
            next: (companies) => {
                this.companies = companies;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load companies',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    loadManagerUsers() {
        this.userService.getAllUsers().subscribe({
            next: (users) => {
                // Filter only users with Manager role
                this.managerUsers = users.filter(u => u.roleName === 'Manager');
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
        this.companyForm = {
            name: '',
            description: '',
            maxBranches: 1,
            managerUserId: null
        };
        this.displayCompanyDialog = true;
    }

    showEditDialog(company: Company) {
        this.isEditMode = true;
        this.selectedCompany = company;
        this.companyForm = {
            name: company.name,
            description: company.description,
            maxBranches: company.maxBranches
        };
        this.displayCompanyDialog = true;
    }

    hideCompanyDialog() {
        this.displayCompanyDialog = false;
        this.selectedCompany = undefined;
    }

    saveCompany() {
        if (this.isEditMode && this.selectedCompany) {
            const request: UpdateCompanyRequest = {
                name: this.companyForm.name,
                description: this.companyForm.description,
                maxBranches: this.companyForm.maxBranches
            };

            this.companyService.updateCompany(this.selectedCompany.id, request).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Company updated successfully',
                        life: 3000
                    });
                    this.loadCompanies();
                    this.hideCompanyDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to update company',
                        life: 3000
                    });
                }
            });
        } else {
            const request: CreateCompanyRequest = {
                name: this.companyForm.name,
                description: this.companyForm.description,
                maxBranches: this.companyForm.maxBranches,
                managerUserId: this.companyForm.managerUserId
            };

            this.companyService.createCompany(request).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Company created successfully',
                        life: 3000
                    });
                    this.loadCompanies();
                    this.hideCompanyDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to create company',
                        life: 3000
                    });
                }
            });
        }
    }

    deleteCompany(company: Company) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete company "${company.name}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.companyService.deleteCompany(company.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Company deleted successfully',
                            life: 3000
                        });
                        this.loadCompanies();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete company',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    showAssignManagerDialog(company: Company) {
        this.selectedCompany = company;
        this.selectedManagerId = undefined;
        this.displayAssignManagerDialog = true;
    }

    hideAssignManagerDialog() {
        this.displayAssignManagerDialog = false;
        this.selectedCompany = undefined;
        this.selectedManagerId = undefined;
    }

    assignManager() {
        if (!this.selectedCompany || !this.selectedManagerId) return;

        const request: AssignManagerRequest = {
            managerUserId: this.selectedManagerId
        };

        this.companyService.assignManager(this.selectedCompany.id, request).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Manager assigned successfully',
                    life: 3000
                });
                this.loadCompanies();
                this.hideAssignManagerDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Failed to assign manager',
                    life: 3000
                });
            }
        });
    }

    unassignManager(companyId: number, managerId: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to unassign this manager?',
            header: 'Unassign Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.companyService.unassignManager(companyId, managerId).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Manager unassigned successfully',
                            life: 3000
                        });
                        this.loadCompanies();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to unassign manager',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}
