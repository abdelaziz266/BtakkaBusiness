import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from '../services/data.service';

export const SectionGuard: CanActivateFn = (route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);

  const currentSection = dataService.getSelectedSection();
  const requestedPath = route.routeConfig?.path || '';
  // تعريف الـ routes لكل section مع الـ default route
  const sectionConfig: { [key: string]: { routes: string[], default: string } } = {
    'BtakkaInterface': {
      routes: ['FinishingInspectionRequest', 'ContractRequest', 'Planes'],
      default: 'FinishingInspectionRequest'
    },
    'BtakkaErp': {
      routes: ['Account', 'Cost-Center'],
      default: 'Account'
    },
    'BtakkaOperation': {
      routes: [],
      default: 'operation'
    }
  };

  const config = sectionConfig[currentSection];
  
  if (!config) {
    router.navigate(['Account']);
    return false;
  }

  // التحقق من أن الـ route يتبع الـ section المختار
  const isAllowed = config.routes.includes(requestedPath);

  if (isAllowed) {
    return true;
  }

  // لو الـ route مش تابع للـ section، ارجع للـ default route بتاع الـ section ده
  router.navigate([config.default]);
  return false;
};
