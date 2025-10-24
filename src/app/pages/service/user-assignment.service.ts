import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    UserCompanyAssignment,
    UserBranchAssignment,
    UserNavigationResponse,
    BranchNavigation
} from '../../models/user-assignment.model';

@Injectable({
    providedIn: 'root'
})
export class UserAssignmentService {
    private apiUrl = `${environment.apiUrl}/userassignment`;

    // Store user's navigation data
    private navigationSubject = new BehaviorSubject<UserNavigationResponse | null>(null);
    public navigation$ = this.navigationSubject.asObservable();

    // Store all available branches for the user (flattened)
    private availableBranchesSubject = new BehaviorSubject<BranchNavigation[]>([]);
    public availableBranches$ = this.availableBranchesSubject.asObservable();

    constructor(private http: HttpClient) {}

    getMyCompanies(): Observable<UserCompanyAssignment[]> {
        return this.http.get<UserCompanyAssignment[]>(`${this.apiUrl}/my-companies`);
    }

    getMyBranches(): Observable<UserBranchAssignment[]> {
        return this.http.get<UserBranchAssignment[]>(`${this.apiUrl}/my-branches`);
    }

    getMyNavigation(): Observable<UserNavigationResponse> {
        return this.http.get<UserNavigationResponse>(`${this.apiUrl}/my-navigation`).pipe(
            tap(navigation => {
                this.navigationSubject.next(navigation);

                // Flatten all branches from all companies and add company info
                const allBranches: BranchNavigation[] = [];
                navigation.navigation.forEach(company => {
                    company.branches.forEach(branch => {
                        allBranches.push({
                            ...branch,
                            companyId: company.companyId,
                            companyName: company.companyName
                        });
                    });
                });
                this.availableBranchesSubject.next(allBranches);
            })
        );
    }

    getCompanyBranches(companyId: number): Observable<BranchNavigation[]> {
        return this.http.get<BranchNavigation[]>(`${this.apiUrl}/company/${companyId}/branches`);
    }

    // Get current navigation data
    getCurrentNavigation(): UserNavigationResponse | null {
        return this.navigationSubject.value;
    }

    // Get all available branches (flattened)
    getAvailableBranches(): BranchNavigation[] {
        return this.availableBranchesSubject.value;
    }

    // Clear navigation data (useful on logout)
    clearNavigation(): void {
        this.navigationSubject.next(null);
        this.availableBranchesSubject.next([]);
    }
}
