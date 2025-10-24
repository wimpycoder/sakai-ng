import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BranchNavigation } from '../../models/user-assignment.model';

/**
 * Service to manage the currently selected branch context
 * This service provides the selected branch information to all components
 * so they can filter their data accordingly
 */
@Injectable({
    providedIn: 'root'
})
export class BranchContextService {
    private selectedBranchKey = 'selected_branch';

    // Currently selected branch
    private selectedBranchSubject = new BehaviorSubject<BranchNavigation | null>(
        this.loadSelectedBranch()
    );
    public selectedBranch$ = this.selectedBranchSubject.asObservable();

    constructor() {}

    /**
     * Set the currently selected branch
     * This will persist to localStorage and notify all subscribers
     */
    setSelectedBranch(branch: BranchNavigation | null): void {
        if (branch) {
            localStorage.setItem(this.selectedBranchKey, JSON.stringify(branch));
        } else {
            localStorage.removeItem(this.selectedBranchKey);
        }
        this.selectedBranchSubject.next(branch);
    }

    /**
     * Get the currently selected branch (synchronous)
     */
    getSelectedBranch(): BranchNavigation | null {
        return this.selectedBranchSubject.value;
    }

    /**
     * Get the currently selected branch ID
     */
    getSelectedBranchId(): number | null {
        const branch = this.selectedBranchSubject.value;
        return branch ? branch.branchId : null;
    }

    /**
     * Get the currently selected company ID (from the selected branch)
     */
    getSelectedCompanyId(): number | null {
        const branch = this.selectedBranchSubject.value;
        return branch ? branch.companyId : null;
    }

    /**
     * Check if a branch is currently selected
     */
    hasBranchSelected(): boolean {
        return this.selectedBranchSubject.value !== null;
    }

    /**
     * Clear the selected branch (useful on logout)
     */
    clearSelectedBranch(): void {
        localStorage.removeItem(this.selectedBranchKey);
        this.selectedBranchSubject.next(null);
    }

    /**
     * Load selected branch from localStorage
     */
    private loadSelectedBranch(): BranchNavigation | null {
        const stored = localStorage.getItem(this.selectedBranchKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
}
