import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { CustomPaginationComponent, PageChangeEvent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { routes } from '../../../../shared/routes/routes';
import { IApiResponse, IApiResponseWithList } from '../../../../core/models/shared.dto';
import { SharedService } from '../../../../core/services/shared.service';
import { IGetCostCenter, IAddCostCenter } from '../../../../core/models/costCenter.dto';
import { CostCenterService } from '../../../../core/services/cost-center.service';

@Component({
  selector: 'app-cost-center-home',
  standalone: true,
  imports: [CollapseHeaderComponent, ReactiveFormsModule, SelectModule, MultiSelectModule, FormsModule, CommonModule, BsDatepickerModule, RouterLink, CustomPaginationComponent, MatSortModule],
  templateUrl: './cost-center-home.component.html',
  styleUrl: './cost-center-home.component.scss'
})
export class CostCenterHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasAdd', { static: false }) offcanvasAdd!: ElementRef;
  @ViewChild('offcanvasEdit', { static: false }) offcanvasEdit!: ElementRef;

  routes = routes;
  costCenters: IGetCostCenter[] = [];
  filteredCostCenters: IGetCostCenter[] = [];
  costCenter: IGetCostCenter = {
    id: 0,
    code: '',
    name: '',
    level: 0,
    accountType: '',
    notes: '',
    parentCode: '',
    parentName: ''
  };
  costCenterForm!: FormGroup;
  emptyTable = '';
  selectedCostCenterId: number | null = null;
  isEditMode: boolean = false;
  selectedCostCenterForEdit: number | null = null;

  // Pagination
  rowCount = 10;
  pageNumber = 1;
  pagesCount = 0;

  constructor(
    private costCenterService: CostCenterService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.GetCostCenter();
    // Cost Center form matching API structure
    this.costCenterForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]],
      accountType: ['Main', Validators.required],
      notes: [''],
      parentId: [0]
    });
  }

  ngAfterViewInit(): void {
    // Setup offcanvas close event listener for Add
    if (this.offcanvasAdd && this.offcanvasAdd.nativeElement) {
      this.offcanvasAdd.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        this.resetForm();
      });
    }

    // Setup offcanvas close event listener for Edit
    if (this.offcanvasEdit && this.offcanvasEdit.nativeElement) {
      this.offcanvasEdit.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
        this.resetForm();
      });
    }
  }

  GetCostCenter(): void {
    this.costCenterService.GetCostCenter(this.pageNumber, this.rowCount).subscribe({
      next: (res: IApiResponseWithList<IGetCostCenter>) => {
        if (res.status === 200) {
          this.costCenters = res.data.data;
          this.filteredCostCenters = this.costCenters;
          this.pagesCount = res.data.pagesCount || 0;
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({
          status: 500,
          message: 'Failed to fetch cost centers.',
          data: null,
          errors: [],
          errorCode: null
        });
      }
    });
  }

  GetCostCenterById(id: number): void {
    this.costCenterService.GetCostCenterById(id).subscribe({
      next: (res: IApiResponse<IGetCostCenter>) => {
        if (res.status === 200 && res.data) {
          this.fillFormForEdit(res.data);
        }
      },
      error: () => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to load cost center data', data: null, errors: [], errorCode: null });
      }
    });
  }

  resetForm(): void {
    this.costCenterForm.reset({
      code: '',
      name: '',
      level: 0,
      accountType: 'Main',
      notes: '',
      parentId: 0
    });
    this.isEditMode = false;
    this.selectedCostCenterForEdit = null;
    this.filteredCostCenters = this.costCenters;
  }

  fillFormForEdit(costCenter: IGetCostCenter): void {
    this.costCenterForm.patchValue({
      code: costCenter.code,
      name: costCenter.name,
      level: costCenter.level,
      accountType: costCenter.accountType,
      notes: costCenter.notes,
      parentId: costCenter.parentId || 0
    });
  }

  submitForm(): void {
    if (this.costCenterForm.invalid) {
      this.costCenterForm.markAllAsTouched();
      this.costCenterForm.updateValueAndValidity();
      return;
    }

    if (this.isEditMode && this.selectedCostCenterForEdit) {
      this.editCostCenter();
    } else {
      this.createCostCenter();
    }
  }

  createCostCenter(): void {
    const values = this.costCenterForm.value;

    const costCenterData: IAddCostCenter = {
      code: values.code ?? '',
      name: values.name ?? '',
      level: values.level ?? 0,
      accountType: values.accountType ?? 'Main',
      notes: values.notes ?? '',
      parentId: values.parentId ?? 0
    };

    this.costCenterService.createCostCenter(costCenterData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_add');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200) {
          this.GetCostCenter();
          this.resetForm();
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({
          status: 500,
          message: 'Failed to create cost center.',
          data: null,
          errors: [],
          errorCode: null
        });
      }
    });
  }

  editCostCenter(): void {
    const values = this.costCenterForm.value;

    const costCenterData: IAddCostCenter = {
      code: values.code ?? '',
      name: values.name ?? '',
      level: values.level ?? 0,
      accountType: values.accountType ?? 'Main',
      notes: values.notes ?? '',
      parentId: values.parentId ?? 0
    };

    this.costCenterService.update(Number(this.selectedCostCenterForEdit), costCenterData).subscribe({
      next: (res) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_edit');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200) {
          this.GetCostCenter();
          this.resetForm();
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({
          status: 500,
          message: 'Failed to update cost center.',
          data: null,
          errors: [],
          errorCode: null
        });
      }
    });
  }

  openDeleteModal(costCenterId: number): void {
    this.selectedCostCenterId = costCenterId;
  }

  openEditModal(costCenterId: number): void {
    this.isEditMode = true;
    this.selectedCostCenterForEdit = costCenterId;
    this.filteredCostCenters = this.costCenters.filter(cc => cc.id !== costCenterId);
    this.GetCostCenterById(costCenterId);
  }

  onDeleteCostCenter(costCenterId: number | null): void {
    if (costCenterId == null) return;
    this.costCenterService.deleteCostCenter(costCenterId).subscribe({
      next: (res) => {
        this.GetCostCenter();
      },
      error: (err) => {
        this.GetCostCenter();
      }
    });
  }

  sortData(sort: any) {
    const data = this.costCenters.slice();
    if (!sort.active || sort.direction === '') {
      this.costCenters = data;
      return;
    }
    this.costCenters = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'code':
          return compare(a.code, b.code, isAsc);
        case 'accountType':
          return compare(a.accountType, b.accountType, isAsc);
        case 'level':
          return compare(a.level, b.level, isAsc);
        default:
          return 0;
      }
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNumber = event.pageNumber;
    this.rowCount = event.rowCount;
    this.GetCostCenter();
  }

  onlyNumbers(event: KeyboardEvent): void {
    const allowed = /[0-9]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
    }
  }
}

function compare(v1: string | number | undefined, v2: string | number | undefined, isAsc: boolean) {
  const a = (v1 ?? '').toString().toLowerCase();
  const b = (v2 ?? '').toString().toLowerCase();
  return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
}
