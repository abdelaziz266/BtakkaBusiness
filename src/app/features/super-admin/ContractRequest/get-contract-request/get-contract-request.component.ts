import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { PaginationService } from '../../../../core/services/pagination.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
import { ContractRequetService } from '../../../../core/services/contract-requet.service';
import { SharedService } from '../../../../core/services/shared.service';
import { IGetContractRequest, IGetContractRequestParams } from '../../../../core/models/contractRequest.dto';

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
  routes = routes;
  
  contractRequests: IGetContractRequest[] = [];
  visibleRequests: IGetContractRequest[] = [];
  
  planId: string = '';
  fromDate: Date | undefined;
  toDate: Date | undefined;
  statusFilter: 'all' | 'read' | 'unread' = 'all';
  pageNumber: number = 1;
  pageSize: number = 15;
  totalPages: number = 0;
  isLoading: boolean = false;

  constructor(
    private contractService: ContractRequetService,
    private pagination: PaginationService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // Get planId from route params
    this.planId = this.route.snapshot.paramMap.get('planId') || '';
    
    // Subscribe to pagination changes
    this.pagination.tablePageSize.subscribe(({ skip, limit }) => {
      this.pageNumber = Math.floor(skip / limit) + 1;
      this.loadContractRequests();
    });

    // Load initial data
    this.loadContractRequests();
  }

  loadContractRequests(): void {
    this.isLoading = true;
    const params: IGetContractRequestParams = {
      lang: 'en',
      planId: this.planId,
      fromDate: this.fromDate ? this.formatDate(this.fromDate) : undefined,
      toDate: this.toDate ? this.formatDate(this.toDate) : undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    this.contractService.getContractRequests(params).subscribe({
      next: (response) => {
        let data = response.data.data || [];
        
        // Apply status filter
        if (this.statusFilter !== 'all') {
          data = data.filter(req => {
            if (this.statusFilter === 'read') return req.isRead === true;
            if (this.statusFilter === 'unread') return req.isRead === false;
            return true;
          });
        }
        
        this.contractRequests = data;
        this.totalPages = response.data.pagesCount || 0;
        this.visibleRequests = this.contractRequests;

        // Update pagination
        const serials = Array.from({ length: this.contractRequests.length }, (_, i) => 
          (this.pageNumber - 1) * this.pageSize + i + 1
        );
        
        this.pagination.calculatePageSize.next({
          totalData: this.totalPages * this.pageSize,
          pageSize: this.pageSize,
          tableData: this.contractRequests,
          serialNumberArray: serials,
          tableDataCopy: [...this.contractRequests],
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.sharedService.handleError(err);
        this.isLoading = false;
      }
    });
  }

  onFromDateChange(): void {
    if (!this.fromDate) {
      this.toDate = undefined;
    }
    this.pageNumber = 1; // Reset to first page
    this.loadContractRequests();
  }

  onToDateChange(): void {
    if (this.fromDate && this.toDate && this.toDate < this.fromDate) {
      this.toDate = undefined;
    }
    this.pageNumber = 1; // Reset to first page
    this.loadContractRequests();
  }

  applyStatusFilter(): void {
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
    const rows = this.contractRequests.map((req) => [
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
    const rows = this.contractRequests.map((req) => [
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

    this.contractRequests.sort((a, b) => {
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

    this.visibleRequests = this.contractRequests;
    const serials = Array.from({ length: this.contractRequests.length }, (_, i) => i + 1);
    this.pagination.calculatePageSize.next({
      totalData: this.contractRequests.length,
      pageSize: this.pageSize,
      tableData: this.contractRequests,
      serialNumberArray: serials,
      tableDataCopy: [...this.contractRequests],
    });
  }
}
