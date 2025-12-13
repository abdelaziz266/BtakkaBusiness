import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service'; // ✅ لازم يكون موجود

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'au52th2t6en';
  private readonly SECRET_KEY = environment.secretKey;

  constructor(private cookieService: CookieService) {}

  /**
   * ✅ حفظ التوكين بعد تشفيره في الـ cookies
   */
  saveToken(token: string): void {
    const encrypted = CryptoJS.AES.encrypt(token, this.SECRET_KEY).toString();

    // حفظ في الكوكيز مع إعدادات الأمان
    this.cookieService.set(this.TOKEN_KEY, encrypted, {
      expires: 1,          // صلاحية يوم واحد
      sameSite: 'Strict',  // يمنع التسريب عبر مواقع أخرى
      secure: true,        // فقط عبر HTTPS
      path: '/'            // متاح على مستوى التطبيق كله
    });
  }

  /**
   * 🔓 فك تشفير التوكين عند قراءته
   */
  getToken(): string | null {
    const encrypted = this.cookieService.get(this.TOKEN_KEY);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * ❌ حذف التوكين (عند تسجيل الخروج)
   */
  clearToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
  }

  /**
   * 🧠 التحقق من وجود توكين صالح
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // موجود = true
  }
}
