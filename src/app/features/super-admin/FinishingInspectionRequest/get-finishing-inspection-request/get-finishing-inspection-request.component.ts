import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomPaginationComponent, PageChangeEvent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { IGetFinishingInspectionRequest } from '../../../../core/models/FinishingInspectionRequest.dto';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
import { FinishingInspectionRequestService, IGetFinishingInspectionRequestParams } from '../../../../core/services/finishing-inspection-request.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-get-finishing-inspection-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    MatSortModule,
    CustomPaginationComponent,
    RouterLink,

  ],
  templateUrl: './get-finishing-inspection-request.component.html',
  styleUrl: './get-finishing-inspection-request.component.scss'
})
export class GetFinishingInspectionRequestComponent implements OnInit {
  routes = routes;
  
  data: IGetFinishingInspectionRequest[] = [];

  fromDate: Date | undefined;
  toDate: Date | undefined;
  statusFilter: 'all' | 'followed' | 'not-followed' = 'all';
  textSearch: string = '';
  
  // Pagination
  readonly rowCount = 10;
  pageNumber = 1;
  pagesCount = 0;

  constructor(
    private finishingInspectionService: FinishingInspectionRequestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    
    const params: IGetFinishingInspectionRequestParams = {
      pageNumber: this.pageNumber,
      rowCount: this.rowCount,
      lang: 'en'
    };

    // Add status filter
    if (this.statusFilter === 'followed') {
      params.requestStatus = true;
    } else if (this.statusFilter === 'not-followed') {
      params.requestStatus = false;
    }

    // Add date filters
    if (this.fromDate) {
      params.From = this.formatDate(this.fromDate);
    }
    if (this.toDate) {
      params.To = this.formatDate(this.toDate);
    }

    // Add text search
    if (this.textSearch && this.textSearch.trim()) {
      params.textSearch = this.textSearch.trim();
    }

    this.finishingInspectionService.getFinishingInspectionRequests(params).subscribe({
      next: (response) => {
        debugger
        if (response.status === 200 && response.data) {
          this.data = response.data.data;
          this.pagesCount = response.data.pagesCount || 0;
        } else {
          this.toastr.error(response.message || 'Failed to load data');
        }
      },
      error: (error) => {
        this.toastr.error('Error loading finishing inspection requests');
        console.error('Error:', error);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNumber = event.pageNumber;
    this.loadData();
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadData();
  }

  onFromDateChange(): void {
    if (!this.fromDate) {
      this.toDate = undefined;
    }
  }

  onToDateChange(): void {
    if (this.fromDate && this.toDate && this.toDate < this.fromDate) {
      this.toDate = undefined;
    }
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadData();
  }

  markFollowed(request: IGetFinishingInspectionRequest): void {
    request.isCommunicated = true;
    // TODO: Call API to update status
  }
  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const field = sort.active;
    const direction = sort.direction === 'asc' ? 'asc' : 'desc';

    this.data.sort((a, b) => {
      let aValue: any = a[field as keyof IGetFinishingInspectionRequest];
      let bValue: any = b[field as keyof IGetFinishingInspectionRequest];

      if (field === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  resetFilters(): void {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.statusFilter = 'all';
    this.textSearch = '';
    this.pageNumber = 1;
    this.loadData();
  }
}
