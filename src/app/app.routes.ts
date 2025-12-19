import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guard/no-auth.guard';
import { AuthGuard } from './core/guard/auth.guard';
import { SectionGuard } from './core/guard/section.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'account',
    pathMatch: 'full'
  },

  {
    path: '',
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent),
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent), canActivate: [NoAuthGuard] }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./features/features.component').then(m => m.FeaturesComponent),
    children: [
      {
        path: '', // 👈 فاضي عشان /companies
        loadComponent: () => import('./features/super-admin/super-admin.component').then(m => m.SuperAdminComponent),
        children: [
          {
            path: 'account', // 👈 كده URL هيبقى /accounts
            loadComponent: () => import('./features/super-admin/accounts/accounts-home/accounts-home.component').then(m => m.AccountsHomeComponent),
            canActivate: [AuthGuard, SectionGuard]
          },
          {
            path: 'cost-center', // 👈 كده URL هيبقى /co
            loadComponent: () => import('./features/super-admin/CostCenter/cost-center-home/cost-center-home.component').then(m => m.CostCenterHomeComponent),
            canActivate: [AuthGuard, SectionGuard]
          },
          {
            path: 'FinishingInspectionRequest', // 👈 كده URL هيبقى /co
            loadComponent: () => import('./features/super-admin/FinishingInspectionRequest/get-finishing-inspection-request/get-finishing-inspection-request.component').then(m => m.GetFinishingInspectionRequestComponent),
            canActivate: [AuthGuard, SectionGuard]
          },
          {
            path: 'ContractRequest',
            loadComponent: () => import('./features/super-admin/ContractRequest/get-contract-request/get-contract-request.component').then(m => m.GetContractRequestComponent),
            canActivate: [AuthGuard, SectionGuard]
          },
          {
            path: 'Planes', // 👈 كده URL هيبقى /co
            loadComponent: () => import('./features/super-admin/planes/planes/planes.component').then(m => m.PlanesComponent),
            canActivate: [AuthGuard, SectionGuard]
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'account',
    pathMatch: 'full'
  }
] as const;
