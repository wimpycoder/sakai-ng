import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

// Services
import { UserAssignmentService } from '../../../pages/service/user-assignment.service';
import { BranchContextService } from '../../../pages/service/branch-context.service';
import { AuthService } from '../../../pages/service/auth.service';

// Models
import { BranchNavigation } from '../../../models/user-assignment.model';

@Component({
    selector: 'app-branch-selector',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        ButtonModule
    ],
    template: `
        <div class="branch-selector" *ngIf="shouldShowSelector()">
            <p-select
                [(ngModel)]="selectedBranch"
                [options]="availableBranches"
                (onChange)="onBranchChange($event)"
                optionLabel="branchName"
                [filter]="true"
                filterPlaceholder="Search branches..."
                placeholder="Select Branch"
                [appendTo]="'body'"
                [style]="{ 'min-width': '250px' }"
                [showClear]="false">
                <ng-template #selecteditem let-option>
                    <div *ngIf="option" class="flex items-center gap-2">
                        <i class="pi pi-building text-primary"></i>
                        <div>
                            <div class="font-bold">{{ option.branchName }}</div>
                            <div class="text-sm text-500">{{ option.companyName }}</div>
                        </div>
                    </div>
                    <div *ngIf="!option" class="text-500">
                        No branch selected
                    </div>
                </ng-template>
                <ng-template #item let-option>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-building text-primary"></i>
                            <div class="font-bold">{{ option.branchName }}</div>
                            <i *ngIf="option.isMainBranch" class="pi pi-star-fill text-yellow-500 text-xs ml-auto"></i>
                        </div>
                        <div class="text-sm text-500 ml-6">{{ option.companyName }}</div>
                    </div>
                </ng-template>
                <ng-template #empty>
                    <div class="text-center p-4 text-500">
                        <p>No branches available</p>
                    </div>
                </ng-template>
            </p-select>
        </div>
    `,
    styles: [`
        :host {
            display: contents;
        }

        .branch-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `]
})
export class BranchSelectorComponent implements OnInit, OnDestroy {
    availableBranches: BranchNavigation[] = [];
    selectedBranch: BranchNavigation | null = null;
    private destroy$ = new Subject<void>();

    constructor(
        private userAssignmentService: UserAssignmentService,
        private branchContextService: BranchContextService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        // Subscribe to available branches
        this.userAssignmentService.availableBranches$
            .pipe(takeUntil(this.destroy$))
            .subscribe(branches => {
                this.availableBranches = branches;

                // If no branch is selected and branches are available, select the first one
                if (!this.branchContextService.hasBranchSelected() && branches.length > 0) {
                    // Try to select main branch first, otherwise first branch
                    const mainBranch = branches.find(b => b.isMainBranch);
                    this.selectBranch(mainBranch || branches[0]);
                }
            });

        // Subscribe to selected branch
        this.branchContextService.selectedBranch$
            .pipe(takeUntil(this.destroy$))
            .subscribe(branch => {
                this.selectedBranch = branch;
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onBranchChange(event: any) {
        if (event.value) {
            this.selectBranch(event.value);
        }
    }

    selectBranch(branch: BranchNavigation) {
        this.branchContextService.setSelectedBranch(branch);
    }

    shouldShowSelector(): boolean {
        // Show selector only for Manager and Employee roles
        const role = this.authService.getUserRole();
        return role === 'Manager' || role === 'Employee';
    }
}
