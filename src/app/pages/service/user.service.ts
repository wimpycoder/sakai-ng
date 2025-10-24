import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: number;
    username: string;
    email: string;
    status: string;
    roleId?: number;
    roleName?: string;
    companyId?: number;
    createdAt: Date;
}

export interface UpdateStatusRequest {
    status: string; // 'active' or 'inactive'
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/user`);
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/user/${id}`);
    }

    updateUserStatus(userId: number, status: 'active' | 'inactive'): Observable<any> {
        const request: UpdateStatusRequest = { status };
        return this.http.patch(`${this.apiUrl}/user/${userId}/status`, request);
    }

    activateUser(userId: number): Observable<any> {
        return this.updateUserStatus(userId, 'active');
    }

    deactivateUser(userId: number): Observable<any> {
        return this.updateUserStatus(userId, 'inactive');
    }
}
