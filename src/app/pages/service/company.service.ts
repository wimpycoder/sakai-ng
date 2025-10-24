import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyRequest, UpdateCompanyRequest, AssignManagerRequest } from '../../models/company.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/company`;

    constructor(private http: HttpClient) {}

    getAllCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl);
    }

    getCompany(id: number): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${id}`);
    }

    createCompany(request: CreateCompanyRequest): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    updateCompany(id: number, request: UpdateCompanyRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, request);
    }

    deleteCompany(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignManager(companyId: number, request: AssignManagerRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/${companyId}/assign-manager`, request);
    }

    unassignManager(companyId: number, managerId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${companyId}/unassign-manager/${managerId}`);
    }
}
