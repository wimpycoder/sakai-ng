import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../pages/service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Clone the request and add authorization header if token exists
    if (token) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedRequest);
    }

    return next(req);
};
