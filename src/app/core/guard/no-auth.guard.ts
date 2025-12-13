import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    const token = this.tokenService.getToken();;
    // ✅ لو فيه token المستخدم بالفعل عامل Login → نرجّعه على Home
    if (token) {
      return this.router.parseUrl('/company');
    }

    // ✅ لو مفيش token يدخل عادي على صفحة الـ Login أو Register
    return true;
  }
}
