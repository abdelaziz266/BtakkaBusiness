import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageChangeEvent {
  pageNumber: number;
  rowCount: number;
}

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class CustomPaginationComponent implements OnChanges {
  @Input() pagesCount: number = 0;
  @Input() pageNumber: number = 1;
  @Input() rowCount: number = 10;

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  currentPage = 1;
  pageNumberArray: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagesCount'] || changes['pageNumber']) {
      this.currentPage = this.pageNumber;
      this.pageNumberArray = Array.from({ length: this.pagesCount }, (_, i) => i + 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagesCount && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCount });
    }
  }

  next(): void {
    if (this.currentPage < this.pagesCount) {
      this.currentPage++;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCount });
    }
  }

  previous(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit({ pageNumber: this.currentPage, rowCount: this.rowCount });
    }
  }
}
