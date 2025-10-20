import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Role {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    userCount: number;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
}

export interface AssignRoleRequest {
    userId: number;
    roleId: number;
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.apiUrl}/role`);
    }

    getRole(id: number): Observable<Role> {
        return this.http.get<Role>(`${this.apiUrl}/role/${id}`);
    }

    createRole(role: CreateRoleRequest): Observable<Role> {
        return this.http.post<Role>(`${this.apiUrl}/role`, role);
    }

    updateRole(id: number, role: UpdateRoleRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/role/${id}`, role);
    }

    deleteRole(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/role/${id}`);
    }

    assignRole(request: AssignRoleRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/role/assign`, request);
    }

    unassignRole(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/role/unassign/${userId}`);
    }
}
