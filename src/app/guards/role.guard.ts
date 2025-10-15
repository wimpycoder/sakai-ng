import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../pages/service/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (!authService.isLoggedIn()) {
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data['roles'] as string[];
    const requiredPermissions = route.data['permissions'] as string[];

    // If no specific roles or permissions required, just check if authenticated
    if (!requiredRoles && !requiredPermissions) {
        return true;
    }

    // Check roles
    if (requiredRoles && requiredRoles.length > 0) {
        if (!authService.hasAnyRole(requiredRoles)) {
            router.navigate(['/auth/access']); // Access denied page
            return false;
        }
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
        if (!authService.hasAnyPermission(requiredPermissions)) {
            router.navigate(['/auth/access']); // Access denied page
            return false;
        }
    }

    return true;
};
