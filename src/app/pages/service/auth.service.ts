import { HttpClient } from '@angular/common/http';
import { Injectable, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserAssignmentService } from './user-assignment.service';
import { BranchContextService } from './branch-context.service';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    companyId?: number;
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenKey = 'jwt_token';
    private userKey = 'current_user';

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private injector: Injector
    ) {}

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap({
                next: (response) => {
                    if (response.token) {
                        this.setToken(response.token);
                        this.setUser(response);
                        this.isAuthenticatedSubject.next(true);

                        // After login, fetch user navigation data
                        // Use setTimeout to avoid issues with lazy injection during response handling
                        setTimeout(() => {
                            try {
                                // Fetch navigation data for Manager and Employee roles
                                const role = this.getUserRole();
                                if (role === 'Manager' || role === 'Employee') {
                                    const userAssignmentService = this.injector.get(UserAssignmentService);
                                    // Fetch navigation in background - don't let it fail the login
                                    userAssignmentService.getMyNavigation().subscribe({
                                        error: (err) => {
                                            console.warn('Failed to load navigation data:', err);
                                            // Continue anyway - user can still use the app
                                        }
                                    });
                                }
                            } catch (err) {
                                console.warn('Error initializing navigation:', err);
                            }
                        }, 0);
                    }
                },
                error: (err) => {
                    console.error('Login error:', err);
                }
            })
        );
    }

    register(userData: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    logout(): void {
        try {
            // Clear navigation and branch context on logout
            const userAssignmentService = this.injector.get(UserAssignmentService);
            const branchContextService = this.injector.get(BranchContextService);

            userAssignmentService.clearNavigation();
            branchContextService.clearSelectedBranch();
        } catch (err) {
            console.warn('Error clearing services on logout:', err);
            // Continue with logout anyway
        }

        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    setUser(user: AuthResponse): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    getUser(): AuthResponse | null {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return this.hasToken() && !this.isTokenExpired();
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            return Math.floor(new Date().getTime() / 1000) >= expiry;
        } catch (error) {
            return true;
        }
    }

    getUsernameFromToken(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.unique_name || payload.username || null;
        } catch (error) {
            return null;
        }
    }

    // Get user role from JWT token
    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        } catch (error) {
            return null;
        }
    }

    // Get user permissions from JWT token
    getUserPermissions(): string[] {
        const token = this.getToken();
        if (!token) return [];

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const permissionsString = payload.permissions || '[]';
            return JSON.parse(permissionsString);
        } catch (error) {
            return [];
        }
    }

    // Check if user has a specific role
    hasRole(role: string): boolean {
        const userRole = this.getUserRole();
        return userRole === role;
    }

    // Check if user has any of the specified roles
    hasAnyRole(roles: string[]): boolean {
        const userRole = this.getUserRole();
        return userRole !== null && roles.includes(userRole);
    }

    // Check if user has a specific permission
    hasPermission(permission: string): boolean {
        const permissions = this.getUserPermissions();
        return permissions.includes(permission);
    }

    // Check if user has any of the specified permissions
    hasAnyPermission(permissions: string[]): boolean {
        const userPermissions = this.getUserPermissions();
        return permissions.some(p => userPermissions.includes(p));
    }

    // Check if user has all specified permissions
    hasAllPermissions(permissions: string[]): boolean {
        const userPermissions = this.getUserPermissions();
        return permissions.every(p => userPermissions.includes(p));
    }

    // Check if user is admin
    isAdmin(): boolean {
        return this.hasRole('Admin');
    }
}
