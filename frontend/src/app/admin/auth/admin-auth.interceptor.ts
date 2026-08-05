import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const isAdminRequest = req.url.includes('/admin/') && !req.url.includes('/admin/auth/login');
  if (!isAdminRequest) {
    return next(req);
  }

  const auth = inject(AdminAuthService);
  const router = inject(Router);
  const token = auth.getToken();
  const authorizedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigateByUrl('/admin/login');
      }
      return throwError(() => error);
    }),
  );
};
