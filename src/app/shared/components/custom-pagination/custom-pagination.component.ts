import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface PageChangeEvent {
  pageNumber: number;
  rowCount: number;
}

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
})
export class CustomPaginationComponent implements OnChanges {
  @Input() pagesCount: number = 0;
  @Input() pageNumber: number = 1;
  @Input() rowCount: number = 10;

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  currentPage = 1;
  pageNumberArray: number[] = [];
  rowCountInput: number = 10;
  rowCountOptions = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagesCount'] || changes['pageNumber']) {
      this.currentPage = this.pageNumber;
      this.pageNumberArray = Array.from({ length: this.pagesCount }, (_, i) => i + 1);
    }
    if (changes['rowCount']) {
      this.rowCountInput = this.rowCount;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagesCount && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCountInput });
    }
  }

  next(): void {
    if (this.currentPage < this.pagesCount) {
      this.currentPage++;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCountInput });
    }
  }

  previous(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCountInput });
    }
  }

  goToFirst(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCountInput });
    }
  }

  goToLast(): void {
    if (this.currentPage !== this.pagesCount) {
      this.currentPage = this.pagesCount;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCountInput });
    }
  }

  onRowCountChange(): void {
    if (this.rowCountInput > 0) {
      this.currentPage = 1;
      this.pageChange.emit({ pageNumber: 1, rowCount: this.rowCountInput });
    }
  }
}
