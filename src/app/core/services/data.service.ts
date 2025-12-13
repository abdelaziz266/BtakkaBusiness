import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiResultFormat } from '../models/pages.model';
import { routes } from '../../shared/routes/routes';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) { }

  private collapseSubject = new BehaviorSubject<boolean>(false);
  collapse$ = this.collapseSubject.asObservable();

  toggleCollapse() {
    this.collapseSubject.next(!this.collapseSubject.value);
  }

  public getContactList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/contact-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCompaniesList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/companies-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getLanguageSetting(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/language-setting.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getFile(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/files.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCallHistory(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/call-history.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getFileShared(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/file-shared.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLeadsList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/leads.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDealsList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/deals.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getLanguageSettingsWeb(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/language-settings-web.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getBlogCategories(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/blog-categories.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getBlogTags(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/blog-tags.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getBlogComments(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/blog-comments.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getFaq(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/faq.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDataTable() {
    return this.http.get<apiResultFormat>('assets/json/data-tables.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTestimonials(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/testimonials.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCountries(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/countries.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getStates(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/states.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCities(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/city.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSource(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/sources.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSuperAdminCompanies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/superadmincompanies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getLostReason(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/lost-reason.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getContactStage(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/contact-stage.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getIndustry(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/industry.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCalls(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/calls.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTaskReport(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/task.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getMembershipTransactions(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/membership-transactions.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getManageUsers(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/manage-users.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getRolesPermissions(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/roles-permissions.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDeleteRequest(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/delete-request.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getLeadReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/lead-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDealReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/deal-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getContactReports() {
    return this.http
      .get<apiResultFormat>('assets/json/contact-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCompanyReports() {
    return this.http
      .get<apiResultFormat>('assets/json/companies-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPages(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/pages.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getProjectLists(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/project-lists.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getActivitiesList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/activities-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProjectReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/project-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCompaignList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/campaign-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCompaignArchive(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/campaign-archive.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPipeline(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/pipeline.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getActivityCalls(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/activity-calls.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getActivityMail(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/activity-mail.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getActivityMeeting(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/activity-meeting.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getActivityTask(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/activity-task.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCompaniesReports(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/companies-reports.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getPackage(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/package-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getSubscription(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/subscription.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPurchaseTransaction(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/purchase-transaction.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDomain(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/domain.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPackages(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/packages.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getCompanies(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/companies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public sidebarData1: any[] = [
    
    {
      tittle: 'Btakka Home',
      showAsTab: true,
      separateRoute: false,
      menu: [
        // {
        //   menuValue: 'Accounts',
        //   icon: 'building-community',
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   route: routes.accountsGrid,
        //   base: 'accounts',
        //   subRoutes: [],
        // },
        // {
        //   menuValue: 'Cost Center',
        //   icon: 'building-community',
        //   hasSubRoute: false,
        //   showSubRoute: false,
        //   route: routes.CostCenter,
        //   base: 'CostCenter',
        //   subRoutes: [],
        // },
        {
          menuValue: 'Inspection Request',
          icon: 'checklist',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.FinishingInspectionRequest,
          base: 'FinishingInspectionRequest',
          subRoutes: [],
        },
        {
          menuValue: 'Contract Request',
          icon: 'file-text',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.ContractRequest,
          base: 'ContractRequest',
          subRoutes: [],
        },
        {
          menuValue: 'Planes',
          icon: 'package',
          hasSubRoute: false,
          showSubRoute: false,
          route: routes.Planes,
          base: 'Planes',
          subRoutes: [],
        }
      ],
    },
  ];
  public videocall = [
    {
      img: 'assets/img/users/user-01.jpg',
      name: 'Barbara',
    },
    {
      img: 'assets/img/users/user-02.jpg',
      name: 'Linnea',
    },
    {
      img: 'assets/img/users/user-05.jpg',
      name: 'Richard',
    },
    {
      img: 'assets/img/users/user-03.jpg',
      name: 'Freda',
    },
  ];



  // public resetData3(): void {
  //   this.sideBar.map((res: SideBar) => {
  //     res.showAsTab = false;
  //     res.menu.map((menus: SideBarMenu) => {
  //       menus.showSubRoute = false;
  //     });
  //   });
  public getTickets(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/tickets.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getContactMessage(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/contact-messages.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProposalsList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/proposals-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getProposalsView(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/proposal-view.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getContractList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/contract-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPaymentList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/payment-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEstimationList(): Observable<apiResultFormat> {
    return this.http
      .get<apiResultFormat>('assets/json/estimation-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoiceList(): Observable<apiResultFormat> {
    return this.http.get<apiResultFormat>('assets/json/invoice-list.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
}
