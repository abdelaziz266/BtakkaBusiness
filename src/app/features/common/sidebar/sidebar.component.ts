/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationStart, Router, Event as RouterEvent, RouterLink } from '@angular/router';
import { routes } from '../../../shared/routes/routes';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { menu, MenuItem, sidebarDataone, SubMenu, url } from '../../../core/models/sidebar.model';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DataService } from '../../../core/services/data.service';
import { CommonService } from '../../../core/services/common.service';
import { SettingsService } from '../../../core/services/settings.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
  imports: [CommonModule, RouterLink, NgScrollbarModule]
})
export class SidebarComponent implements OnInit {
  routes = routes;
  base = '';
  page = '';
  last = '';
  forbase = 'false';
  currentUrl = '';


  public side_bar_data: any[] = [];

  constructor(
    private sidebar: SidebarService,
    private data: DataService,
    private router: Router,
    private common: CommonService,
    private settings: SettingsService,
    private cdr: ChangeDetectorRef
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.getRoutes(event);
        const splitVal = event.url.split('/');
        this.currentUrl = event.url;
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (this.base === 'index') {
          this.page == 'index';
        }

      }
    });
    this.getRoutes(this.router);
    
    // الاستماع لتغيير الـ section
    this.data.selectedSection$.subscribe(() => {
      this.updateSidebarData();
    });
    
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
  }

  ngOnInit(): void {
    // تحديث الـ sidebar بناءً على الـ section والـ claims
    this.updateSidebarData();

    // إعداد sessionStorage للـ menu
    const menuValue = sessionStorage.getItem('menuValue');
    if (!menuValue) {
      sessionStorage.setItem('menuValue', 'Dashboard');
      sessionStorage.setItem('page', 'index');
    }

    this.expandSubMenusActive();
    this.sidebar.collapseSubMenu$.subscribe(() => {
      this.collapseAllSubMenus();
    });
  }

  /**
   * تحديث بيانات الـ sidebar بناءً على الـ section والـ claims
   */
  private updateSidebarData(): void {
    const currentSection = this.data.getSelectedSection();
    console.log('Current Section in Sidebar:', currentSection);
    this.side_bar_data = this.data.getFilteredSidebarData();
    console.log('Filtered Sidebar Data:', this.side_bar_data);
    this.cdr.markForCheck(); // فقط تعليم للتحديث بدون فرضه
  }
  trackMainTitle(index: number, item: any): any {
    return item?.id ?? index;
  }

  trackMenu(index: number, item: any): any {
    return item?.id ?? item?.menuValue ?? index;
  }

  trackSubMenu(index: number, item: any): any {
    return item?.id ?? item?.menuValue ?? index;
  }

  trackSubMenuTwo(index: number, item: any): any {
    return item?.id ?? item?.menuValue ?? index;
  }

  private getRoutes(route: url): void {
    const splitVal = route.url.split('/');
    this.currentUrl = route.url;
    this.base = splitVal[1];
    this.page = splitVal[2];
    if (this.base === 'index' || this.base === 'lead-dashboard') {
      this.forbase = 'true'
    }
  }

  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sidebar.expandSideBar.next('true');
    } else {
      this.sidebar.expandSideBar.next('false');
    }
  }
  onToggleSidebar(): void {
    const layout = document.documentElement.getAttribute('data-layout');

    if (layout === 'hidden') {
      this.settings.togglehidden();
    } else {
      this.toggleSidebarmini();
    }
  }
  toggleSidebar(): void {
    const wrapper = document.getElementsByClassName('main-wrapper')[0];
    const overlay = document.getElementsByClassName('sidebar-overlay')[0];

    if (wrapper) {
      wrapper.classList.remove('slide-nav');
    }

    if (overlay) {
      overlay.classList.remove('opened');
    }

  }
  public toggleSidebarmini(): void {
    this.sidebar.switchSideMenuPosition();
  }

  public expandSubMenus(menu: { menuValue: string; showSubRoute: boolean; }): void {
    sessionStorage.setItem('menuValue', menu.menuValue);

    // Close open main menu when submenu is expanded
    this.openMenuItem = null;

    this.side_bar_data.forEach((mainMenus: sidebarDataone) => {
      mainMenus.menu.forEach((resMenu: MenuItem) => {
        if (resMenu.menuValue === menu.menuValue) {
          resMenu.showSubRoute = !resMenu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }

  openMenuItem: MenuItem | null = null;
  openSubmenuOneItem: SubMenu[] | null = null;
  multiLevel1 = false;
  multiLevel2 = false;
  multiLevel3 = false;

  openMenu(menu: MenuItem): void {
    // Close any expanded submenu when a main menu is clicked
    this.side_bar_data.forEach((mainMenus: sidebarDataone) => {
      mainMenus.menu.forEach((resMenu: MenuItem) => {
        resMenu.showSubRoute = false;
      });
    });

    // Toggle openMenuItem
    if (this.openMenuItem === menu) {
      this.openMenuItem = null;
    } else {
      this.openMenuItem = menu;
    }
  }

  public expandSubMenusActive(): void {
    const activeMenu = sessionStorage.getItem('menuValue');
    const activePage = sessionStorage.getItem('page'); // optional, for submenu match

    if (!Array.isArray(this.side_bar_data)) {
      return;
    }

    this.side_bar_data.forEach((mainMenu: sidebarDataone) => {
      mainMenu.menu.forEach((resMenu: menu) => {
        // Expand only the parent matching session value
        resMenu.showSubRoute = (resMenu.menuValue === activeMenu);

        // Expand subMenus inside that menu
        resMenu.subMenus?.forEach((sub) => {
          sub.showSubRoute = sub.base === activePage || sub.page === activePage;
        });
      });
    });
  }

  openSubmenuOne(subMenus: any): void {
    if (this.openSubmenuOneItem === subMenus) {
      this.openSubmenuOneItem = null;
    } else {
      this.openSubmenuOneItem = subMenus;
    }
  }


  multiLevelOne() {
    this.multiLevel1 = !this.multiLevel1;
  }
  multiLevelTwo() {
    this.multiLevel2 = !this.multiLevel2;
  }
  multiLevelThree() {
    this.multiLevel3 = !this.multiLevel3;
    this.multiLevel2 = true;
  }

  collapseAllSubMenus(): void {
    this.side_bar_data.forEach((mainMenu: sidebarDataone) => {
      mainMenu.menu.forEach((resMenu: menu) => {
        resMenu.showSubRoute = false;
      });
    });
  }
}
