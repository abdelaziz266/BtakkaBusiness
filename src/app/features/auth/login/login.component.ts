import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IApiResponse } from '../../../core/models/shared.dto';
import { ILoginResponse } from '../../../core/models/auth.dto';
import { TokenService } from '../../../core/services/token.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {

  loading = false;
  passwordVisible = false;
  loginForm!: FormGroup;
    public side_bar_data: any[] = [];


  constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private tokenService: TokenService,
  private router: Router // ✅ أضف ده
) {}
  ngOnInit(): void {
    // ✅ إنشاء الـ FormGroup
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

  }

  get userName() {
    return this.loginForm.get('userName')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
  onSubmit() {
    debugger
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.authService.login(this.userName.value!, this.password.value!).subscribe({
    next: (res: IApiResponse<ILoginResponse>) => {
      if (res.data?.token) {
        debugger;
        this.tokenService.saveToken(res.data.token);

        // ✅ بعد حفظ التوكن يروح على صفحة الشركات
        this.router.navigate(['/company']);
      }

      this.loading = false;
    },
    error: (err) => {
      debugger;
      this.loading = false;
    },
    complete: () => (this.loading = false),
  });
}

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
