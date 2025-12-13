import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { IGetFinishingInspectionRequest } from '../../../../core/models/FinishingInspectionRequest.dto';
import { PaginationService } from '../../../../core/services/pagination.service';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../shared/routes/routes';
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
  
  getFinishingInspectionRequests: IGetFinishingInspectionRequest[] = [];
  filteredRequests: IGetFinishingInspectionRequest[] = [];
  visibleRequests: IGetFinishingInspectionRequest[] = [];

  fromDate: Date | undefined;
  toDate: Date | undefined;
  statusFilter: 'all' | 'followed' | 'not-followed' = 'all';
  readonly pageSize = 10;

  constructor(private pagination: PaginationService) {}

  ngOnInit(): void {
    this.generateFakeData(25);
    this.applyFilters();

    this.pagination.tablePageSize.subscribe(({ skip, limit }) => {
      this.visibleRequests = this.filteredRequests.slice(skip, limit);
    });
  }

  private generateFakeData(count: number): void {
    const names = ['Ahmed', 'Sara', 'Omar', 'Laila', 'Hassan', 'Nadia', 'Youssef', 'Mona', 'Khaled', 'Rana'];
    const titles = ['Apartment A', 'Villa B', 'Studio C', 'Penthouse D', 'Duplex E'];
    const streets = ['Tahrir St.', 'Nile Corniche', 'Salah Salem', 'October Bridge', 'Ramses'];

    const today = new Date();
    this.getFinishingInspectionRequests = Array.from({ length: count }, (_, idx) => {
      const name = names[idx % names.length] + ' ' + (idx + 1);
      const title = titles[idx % titles.length];
      const address = `${Math.floor(Math.random() * 100) + 1} ${streets[idx % streets.length]}, Cairo`;
      const phone = `010${String(Math.floor(10000000 + Math.random() * 89999999))}`;
      const date = new Date(today.getTime() - idx * 24 * 60 * 60 * 1000);
      const followedUp = idx % 3 === 0; // some done, some pending
      return {
        id: idx + 1,
        customerName: name,
        unitTitle: title,
        unitAddress: address,
        phoneNumber: phone,
        date,
        followedUp,
      } as IGetFinishingInspectionRequest;
    });
  }

  applyFilters(): void {
    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    this.filteredRequests = this.getFinishingInspectionRequests.filter((req) => {
      const afterFrom = from ? req.date >= from : true;
      const beforeTo = to ? req.date <= to : true;
      const statusOk =
        this.statusFilter === 'all'
          ? true
          : this.statusFilter === 'followed'
          ? req.followedUp
          : !req.followedUp;
      return afterFrom && beforeTo && statusOk;
    });

    const serials = Array.from({ length: this.filteredRequests.length }, (_, i) => i + 1);
    this.pagination.calculatePageSize.next({
      totalData: this.filteredRequests.length,
      pageSize: this.pageSize,
      tableData: this.filteredRequests,
      serialNumberArray: serials,
      tableDataCopy: [...this.filteredRequests],
    });

    // reset to first page on filter change
    this.pagination.tablePageSize.next({ skip: 0, limit: this.pageSize, pageSize: this.pageSize });
    this.visibleRequests = this.filteredRequests.slice(0, this.pageSize);
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

  markFollowed(request: IGetFinishingInspectionRequest): void {
    request.followedUp = true;
    this.applyFilters();
  }

  exportPDF(): void {
    const headers = ['Customer Name', 'Unit Title', 'Unit Address', 'Phone', 'Date', 'Status'];
    const rows = this.filteredRequests.map((req) => [
      req.customerName,
      req.unitTitle,
      req.unitAddress,
      req.phoneNumber,
      new Date(req.date).toLocaleDateString(),
      req.followedUp ? 'Followed' : 'Not Followed'
    ]);

    // Create table HTML
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

    // Open print dialog with formatted table
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write('<html><head><title>Inspection Requests</title>');
    printWindow?.document.write('<style>');
    printWindow?.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow?.document.write('h1 { color: #333; }');
    printWindow?.document.write('table { border-collapse: collapse; width: 100%; }');
    printWindow?.document.write('th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }');
    printWindow?.document.write('th { background-color: #D71716; color: white; }');
    printWindow?.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow?.document.write('</style></head><body>');
    printWindow?.document.write('<h1>Inspection Requests Report</h1>');
    printWindow?.document.write(tableHtml);
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.print();
  }

  exportExcel(): void {
    const headers = ['Customer Name', 'Unit Title', 'Unit Address', 'Phone', 'Date', 'Status'];
    const rows = this.filteredRequests.map((req) => [
      req.customerName,
      req.unitTitle,
      req.unitAddress,
      req.phoneNumber,
      new Date(req.date).toLocaleDateString(),
      req.followedUp ? 'Followed' : 'Not Followed'
    ]);

    // Build CSV with proper formatting
    let csvContent = headers.map((h) => `"${h}"`).join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inspection-requests.csv');
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

    this.filteredRequests.sort((a, b) => {
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

    // Recalculate pagination with sorted data
    const serials = Array.from({ length: this.filteredRequests.length }, (_, i) => i + 1);
    this.pagination.calculatePageSize.next({
      totalData: this.filteredRequests.length,
      pageSize: this.pageSize,
      tableData: this.filteredRequests,
      serialNumberArray: serials,
      tableDataCopy: [...this.filteredRequests],
    });

    this.pagination.tablePageSize.next({ skip: 0, limit: this.pageSize, pageSize: this.pageSize });
    this.visibleRequests = this.filteredRequests.slice(0, this.pageSize);
  }
}
