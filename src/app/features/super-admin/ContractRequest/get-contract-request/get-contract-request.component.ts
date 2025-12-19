import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomPaginationComponent, PageChangeEvent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { RouterLink, Router } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
import { ContractRequetService } from '../../../../core/services/contract-requet.service';
import { SharedService } from '../../../../core/services/shared.service';
import { IGetContractRequest, IGetContractRequestParams } from '../../../../core/models/contractRequest.dto';
import { IGetPlansDTO, IGetPlansSelectListDTO } from '../../../../core/models/plans.dto';
import { IApiResponse } from '../../../../core/models/shared.dto';
import { PlansService } from '../../../../core/services/plans.service';

@Component({
  selector: 'app-get-contract-request',
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
  templateUrl: './get-contract-request.component.html',
  styleUrl: './get-contract-request.component.scss'
})
export class GetContractRequestComponent implements OnInit {
    statusOptions = [
      { label: 'All', value: 'all' },
      { label: 'Read', value: 'read' },
      { label: 'Unread', value: 'unread' }
    ];
  routes = routes;

  data: IGetContractRequest[] = [];

  planId: string = '';
  fromDate: Date | undefined;
  toDate: Date | undefined;
  statusFilter: 'all' | 'read' | 'unread' = 'all';

  // Pagination
  rowCount = 10;
  pageNumber = 1;
  pagesCount = 0;

  // Track previous date values to avoid unnecessary API calls
  private prevFromDate: Date | undefined;
  private prevToDate: Date | undefined;
  //plans list
  plans: IGetPlansSelectListDTO[] = [];
  isPlansFilter: boolean = false;
  constructor(
    private contractService: ContractRequetService,
    private sharedService: SharedService,
    private plansService: PlansService,

  ) { }

  ngOnInit(): void {
    // Get planId from navigation state
    this.planId = history.state?.planId || '';
    if(this.planId == ''){
      this.isPlansFilter = true;
      this.loadPlans();
    }
    this.loadContractRequests();
  }

  loadContractRequests(): void {
    const params: IGetContractRequestParams = {
      lang: 'en',
      planId: this.planId,
      fromDate: this.fromDate ? this.formatDate(this.fromDate) : undefined,
      toDate: this.toDate ? this.formatDate(this.toDate) : undefined,
      pageNumber: this.pageNumber,
      pageSize: this.rowCount,
    };
debugger
    this.contractService.getContractRequests(params).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data) {
          this.data = response.data.data;
          this.pagesCount = response.data.pagesCount || 0;
        }
      },
      error: (err) => {
        this.sharedService.handleError(err);
      }
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNumber = event.pageNumber;
    this.rowCount = event.rowCount;
    this.loadContractRequests();
  }

  onFromDateChange(): void {
    // Skip if date hasn't actually changed
    if (this.fromDate === this.prevFromDate) return;
    this.prevFromDate = this.fromDate;

    if (!this.fromDate) {
      this.toDate = undefined;
      this.prevToDate = undefined;
    }
    this.pageNumber = 1; // Reset to first page
    this.loadContractRequests();
  }

  onToDateChange(): void {
    // Skip if date hasn't actually changed
    if (this.toDate === this.prevToDate) return;
    this.prevToDate = this.toDate;

    if (this.fromDate && this.toDate && this.toDate < this.fromDate) {
      this.toDate = undefined;
      this.prevToDate = undefined;
    }
    this.pageNumber = 1; // Reset to first page
    this.loadContractRequests();
  }

  applyStatusFilter(): void {
    debugger
    this.pageNumber = 1; // Reset to first page
    this.loadContractRequests();
  }

  markAsRead(request: IGetContractRequest): void {
    request.isRead = true;
    this.sharedService.handleResponse({ status: 200, message: 'Marked as read', data: null, errors: [], errorCode: null });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  exportPDF(): void {
    const headers = ['Name', 'Mobile', 'Request Date', 'Status', 'Plan Name', 'Plan Value'];
    const rows = this.data.map((req) => [
      req.name,
      req.mobile,
      new Date(req.requestDate).toLocaleDateString(),
      req.isRead ? 'Read' : 'Unread',
      req.planName,
      req.planValue
    ]);

    let tableHtml = '<table border="1" cellpadding="8" cellspacing="0">';
    tableHtml += '<thead><tr style="background-color: #D71716; color: white;">';
    headers.forEach((h) => {
      tableHtml += `<th>${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    rows.forEach((row) => {
      tableHtml += '<tr>';
      row.forEach((cell) => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Contract Requests</title>');
    printWindow?.document.write('<style>');
    printWindow?.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow?.document.write('h1 { color: #333; }');
    printWindow?.document.write('table { border-collapse: collapse; width: 100%; }');
    printWindow?.document.write('th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }');
    printWindow?.document.write('th { background-color: #D71716; color: white; }');
    printWindow?.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow?.document.write('</style></head><body>');
    printWindow?.document.write('<h1>Contract Requests Report</h1>');
    printWindow?.document.write(tableHtml);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  }

  exportExcel(): void {
    const headers = ['Name', 'Mobile', 'Request Date', 'Status', 'Plan Name', 'Plan Value'];
    const rows = this.data.map((req) => [
      req.name,
      req.mobile,
      new Date(req.requestDate).toLocaleDateString(),
      req.isRead ? 'Read' : 'Unread',
      req.planName,
      req.planValue
    ]);

    let csvContent = headers.map((h) => `"${h}"`).join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contract-requests.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    const field = sort.active;
    const direction = sort.direction === 'asc' ? 'asc' : 'desc';

    this.data.sort((a, b) => {
      let aValue: any = a[field as keyof IGetContractRequest];
      let bValue: any = b[field as keyof IGetContractRequest];

      if (field === 'requestDate') {
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
  private loadPlans(): void {
    this.plansService.getPlans().subscribe({
      next: (response: IApiResponse<IGetPlansDTO[]>) => {
        if (response.data) {
          // Map API response to ICard with fake order if not present
          this.plans = response.data.map((plan: IGetPlansSelectListDTO, index: number) => ({
            id: plan.id,
            title: plan.title
          }));
        }
        debugger
      },
      error: (error) => {
        console.error('Failed to load plans', error);
        // Fallback to fake data if API fails
      }
    });
  }
}
