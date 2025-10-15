import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: 'roles',
        loadComponent: () =>
            import('./role-management/role-management.component').then(
                (m) => m.RoleManagementComponent
            ),
        data: { roles: ['Admin'] }
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./user-management/user-management.component').then(
                (m) => m.UserManagementComponent
            ),
        data: { roles: ['Admin'] }
    }
];
