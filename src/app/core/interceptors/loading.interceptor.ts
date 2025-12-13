import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // لو مكتوب في الهيدر "Skip-Interceptor"، تجاهله تمامًا
  if (req.headers.has('Skip-Interceptor')) {
    return next(req);
  }

  const authService = inject(AuthService);
  authService.show();

  return next(req).pipe(
    finalize(() => {
      authService.hide();
    })
  );
};
