import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { routes } from '../../shared/routes/routes';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userClaims: string[] = [];
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { 
    this.loadUserClaims();
  }

  /**
   * تحميل الـ Claims من التوكين
   */
  private loadUserClaims(): void {
    const tokenData = this.tokenService.decodeToken();
    if (tokenData && tokenData.Claims) {
      this.userClaims = tokenData.Claims;
      console.log('User Claims:', this.userClaims);
    }
  }

  /**
   * التحقق من وجود claim معين
   */
  public hasClaim(claim: string): boolean {
    return this.userClaims.includes(claim);
  }

  /**
   * الحصول على جميع الـ Claims
   */
  public getUserClaims(): string[] {
    return this.userClaims;
  }

  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  // للتحكم في الـ section المختار
  private selectedSectionSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedSection') || 'btakka'
  );
  public selectedSection$ = this.selectedSectionSubject.asObservable();

  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }

  /**
   * تغيير الـ section المختار
   */
  public setSelectedSection(section: string): void {
    localStorage.setItem('selectedSection', section);
    this.selectedSectionSubject.next(section);
    console.log('Section changed to:', section);
  }

  /**
   * الحصول على الـ section الحالي
   */
  public getSelectedSection(): string {
    return this.selectedSectionSubject.value;
  }

  public sidebarData1: any[] = [
    
    {
      tittle: 'Btakka Home',
      section: 'btakka', // الـ section الخاص بهذا القسم
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Inspection Request',
          claim: 'FinishingInseption', // الـ claim المطلوب
          icon: 'clipboard-check',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.FinishingInspectionRequest,
          base: 'FinishingInspectionRequest',
          subRoutes: [],
        },
        {
          menuValue: 'Contract Request',
          claim: 'CompanyService', // الـ claim المطلوب
          icon: 'file-text',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.ContractRequest,
          base: 'ContractRequest',
          subRoutes: [],
        },
        {
          menuValue: 'Planes',
          claim: 'Plan', // الـ claim المطلوب
          icon: 'plane',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.Planes,
          base: 'Planes',
          subRoutes: [],
        }
      ],
    },
    {
      tittle: 'Btakka ERP',
      section: 'erp', // الـ section الخاص بهذا القسم
      showAsTab: true,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Accounts',
          claim: 'ManageAccounts', // الـ claim المطلوب
          icon: 'users',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.accountsGrid,
          base: 'accounts',
          subRoutes: [],
        },
        {
          menuValue: 'Cost Center',
          claim: 'CostCenter', // الـ claim المطلوب
          icon: 'wallet',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.CostCenter,
          base: 'CostCenter',
          subRoutes: [],
        }
      ],
    },
  ];

  /**
   * الحصول على الـ sidebar المفلتر بناءً على الـ Section والـ Claims
   */
  public getFilteredSidebarData(selectedSection?: string): any[] {
    const section = selectedSection || this.getSelectedSection();
    console.log('Filtering sidebar for section:', section);
    
    const filtered = this.sidebarData1
      .filter(sidebarSection => {
        // فلتر بناءً على الـ section المختار
        if (!sidebarSection.section) return true;
        const match = sidebarSection.section === section;
        console.log(`Section "${sidebarSection.tittle}" (${sidebarSection.section}) matches "${section}":`, match);
        return match;
      })
      .map(sidebarSection => {
        const filteredMenu = sidebarSection.menu.filter((menuItem: any) => {
          // إذا لم يكن هناك claim محدد، اعرض العنصر
          if (!menuItem.claim) return true;
          // إذا كان هناك claim، تحقق من وجوده
          return this.hasClaim(menuItem.claim);
        });

        return {
          ...sidebarSection,
          menu: filteredMenu
        };
      })
      .filter(sidebarSection => sidebarSection.menu.length > 0); // احذف الأقسام الفارغة
    
    console.log('Filtered result:', filtered);
    return filtered;
  }
}
