// import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import { SelectModule } from 'primeng/select';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { RouterLink } from '@angular/router';
// import { MatSortModule } from '@angular/material/sort';
// import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
// import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
// import { CompanyService } from '../../../../core/services/company.service';
// import { SharedService } from '../../../../core/services/shared.service';
// import { IProtfolioDto } from '../../../../core/models/Protofolio.dto';
// @Component({
//   selector: 'app-companies-home',
//   standalone: true,
//   imports: [CollapseHeaderComponent, ReactiveFormsModule, SelectModule, MultiSelectModule, FormsModule, CommonModule, BsDatepickerModule, RouterLink, CustomPaginationComponent, MatSortModule],
//   templateUrl: './companies-home.component.html',
//   styleUrl: './companies-home.component.scss'
// })
// export class CompaniesHomeComponent implements OnInit {
//   protfolio: IProtfolioDto[] = [];
//   id: number = 0;
//   isLoading: boolean = true;
//   imageLoaded = {
//     cover: false,
//     logo: false
//   };
  
//   returnData: IResult = {
//     data: {
//       name: '',
//       address: '',
//       about: '',
//       logo: '',
//       cover: '',
//       categories: [],
//       protfolio: []
//     } as ICompanyDto,
//     message: '',
//     status: 0
//   }
//   constructor(private route: ActivatedRoute
//     , private router: Router
//     , private sharedService: SharedService
//     , private companyService: CompanyService
//   ) { };

//   ngOnInit(): void {
    
//     const id = this.route.snapshot.paramMap.get('id');
//     this.id = Number(id);
//     this.GetCompany(this.id);
//   }
//   private GetAccount(): void {
//       this.accountService.GetAccount().subscribe({
//         next: (res: IApiResponse<IGetAccount[]>) => {
//           this.accounts = res.data || [];
//           if (this.accounts.length === 0) this.emptyTable = 'No Data Available';
//         },
//         error: () => { this.emptyTable = 'No Data Available'; }
//       });
//     }
//   GetCompany(companyId: number): void {
//     this.isLoading = true;
//     const observer = {
//       next: (res: IResult) => {
//         this.returnData = res;
//         this.protfolio = this.returnData.data.protfolio;
//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         this.sharedService.handleError(err);
//         this.isLoading = false;
//       },
//     };
//     this.companyService.GetCompany(companyId).subscribe(observer);
//   }
//   seeAllPortfolio() {
//     this.router.navigate(['Protofolio', this.id]);
//   }
// openPortfolio(id: number): void {
//     this.router.navigate(['ProtofolioDetails', id]);

//   }  
  
//   showQRCode(): void {
//     const url = window.location.href;
//     const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
//     // Open QR code in new window
//     window.open(qrCodeUrl, '_blank', 'width=400,height=400');
//   }

//   onImageLoad(imageType: 'cover' | 'logo'): void {
//     this.imageLoaded[imageType] = true;
//   }

//   onPortfolioImageLoad(event: Event): void {
//     const img = event.target as HTMLImageElement;
//     if (img) {
//       img.classList.remove('loading');
//     }
//   }
  
//   requestInspection() { 
    
//     this.router.navigate(['FinishingInspectionRequest']);
//    }
  
//   viewPlans() { 
//     this.router.navigate(['Plans', this.id]);
//   }
  
//   sendQuotation() { /* open quotation */ }
// }
