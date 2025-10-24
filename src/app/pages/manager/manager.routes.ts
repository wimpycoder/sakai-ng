import { Routes } from '@angular/router';
import { roleGuard } from '../../guards/role.guard';

export const managerRoutes: Routes = [
    {
        path: 'users',
        loadComponent: () =>
            import('./user-management.component').then(
                (m) => m.ManagerUserManagementComponent
            ),
        canActivate: [roleGuard],
        data: { roles: ['Manager'] }
    },
    {
        path: 'branches',
        loadComponent: () =>
            import('./branch-management.component').then(
                (m) => m.BranchManagementComponent
            ),
        canActivate: [roleGuard],
        data: { roles: ['Manager'] }
    }
];
