import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Branch, CreateBranchRequest, UpdateBranchRequest, AssignUserToBranchRequest } from '../../models/branch.model';

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    private apiUrl = `${environment.apiUrl}/branch`;

    constructor(private http: HttpClient) {}

    getBranchesByCompany(companyId: number): Observable<Branch[]> {
        return this.http.get<Branch[]>(`${this.apiUrl}/company/${companyId}`);
    }

    getBranch(id: number): Observable<Branch> {
        return this.http.get<Branch>(`${this.apiUrl}/${id}`);
    }

    createBranch(request: CreateBranchRequest): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    updateBranch(id: number, request: UpdateBranchRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, request);
    }

    deleteBranch(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignUserToBranch(branchId: number, request: AssignUserToBranchRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/${branchId}/assign-user`, request);
    }

    unassignUserFromBranch(branchId: number, userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${branchId}/unassign-user/${userId}`);
    }
}
