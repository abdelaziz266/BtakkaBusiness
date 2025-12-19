import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from '../services/data.service';

export const SectionGuard: CanActivateFn = (route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);

  const currentSection = dataService.getSelectedSection();
  const requestedPath = route.routeConfig?.path || '';

  console.log('SectionGuard - Current Section:', currentSection);
  console.log('SectionGuard - Requested Path:', requestedPath);

  // تعريف الـ routes لكل section مع الـ default route
  const sectionConfig: { [key: string]: { routes: string[], default: string } } = {
    'btakka': {
      routes: ['FinishingInspectionRequest', 'ContractRequest', 'Planes'],
      default: 'FinishingInspectionRequest'
    },
    'erp': {
      routes: ['account', 'cost-center'],
      default: 'account'
    },
    'operation': {
      routes: [],
      default: 'account'
    }
  };

  const config = sectionConfig[currentSection];
  
  if (!config) {
    console.warn('SectionGuard - Invalid section, redirecting to account');
    router.navigate(['account']);
    return false;
  }

  // التحقق من أن الـ route يتبع الـ section المختار
  const isAllowed = config.routes.includes(requestedPath);
  console.log('SectionGuard - Is route allowed?', isAllowed);

  if (isAllowed) {
    return true;
  }

  // لو الـ route مش تابع للـ section، ارجع للـ default route بتاع الـ section ده
  console.warn(`SectionGuard - Route "${requestedPath}" not allowed in section "${currentSection}". Redirecting to "${config.default}"`);
  router.navigate([config.default]);
  return false;
};
