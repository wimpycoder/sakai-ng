import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';

export const adminRoutes: Routes = [
    {
        path: 'roles',
        loadComponent: () =>
            import('./role-management/role-management.component').then(
                (m) => m.RoleManagementComponent
            ),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
    },
    {
        path: 'users',
        loadComponent: () =>
            import('./user-management/user-management.component').then(
                (m) => m.UserManagementComponent
            ),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
    }
];
