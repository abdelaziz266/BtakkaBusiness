import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatSortModule } from '@angular/material/sort';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { routes } from '../../../../shared/routes/routes';
import { SharedService } from '../../../../core/services/shared.service';
import { IAddCostCenter, IGetCostCenter } from '../../../../core/models/costCenter.dto';
import { CostCenterService } from '../../../../core/services/cost-center.service';
import { IApiResponse } from '../../../../core/models/shared.dto';

@Component({
  selector: 'app-cost-center-home',
standalone: true,
  imports: [CollapseHeaderComponent, ReactiveFormsModule, SelectModule, MultiSelectModule,
     FormsModule, CommonModule, BsDatepickerModule, RouterLink, CustomPaginationComponent, MatSortModule],
    templateUrl: './cost-center-home.component.html',
  styleUrl: './cost-center-home.component.scss'
})
export class CostCenterHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasAdd', { static: false }) offcanvasAdd!: ElementRef;
  @ViewChild('offcanvasEdit', { static: false }) offcanvasEdit!: ElementRef;

  routes = routes;
  costCenters: IGetCostCenter[] = [];
  costCenter: IGetCostCenter = {
    id: 0,
    level: 0,
    accountType: 0,
    notes: '',
    parentCode: '',
    parentName : '',
    code: '',
    name: ''
  };
  addCostCenter: IAddCostCenter = {
    code: '',
    name: '',
    level: 0,
    costCenterType: '',
    notes: '',
    parentId: 0
  };
  costCenterForm!: FormGroup;
  emptyTable = '';
  selectedCostCenterId: number | null = null;
  isEditMode: boolean = false;
  selectedCostCenterForEdit: number | null = null;
  levels: any[] = [
    { id: 1, name: 'Level1' },
    { id: 2, name: 'Level2' },
    { id: 3, name: 'Level3' },
    { id: 4, name: 'Level4' },
    { id: 5, name: 'Level5' }
  ];
  // account types for select
  accountTypes: any[] = [
    { id: 'Main', name: 'Main' },
    { id: 'Sub', name: 'Sub' }
  ];

  // parent list (populated from fetched cost centers)
  parentOptions: any[] = [
    { id: 1, name: 'Sample Parent 1' },
    { id: 2, name: 'Sample Parent 2' } ,
    { id: 3, name: 'Sample Parent 3' }
  ];
  constructor(
    private costCenterService: CostCenterService,
    private fb: FormBuilder,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.GetCostCenter();
    // CostCenter form matching API structure
    this.costCenterForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      level: [0, [Validators.required, Validators.min(0)]],
      accountType: ['Main', Validators.required],
      notes: [''],
      parentId: [0, [Validators.required, Validators.min(0)]]
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

  resetForm(): void {
    this.isEditMode = false;
    this.selectedCostCenterForEdit = null;
    this.costCenterForm.reset({
      code: '',
      name: '',
      level: 0,
      accountType: 'Main',
      notes: '',
      parentId: 0
    });
  }

  private GetCostCenter(): void {
    this.costCenterService.GetCostCenter().subscribe({
      next: (res: IApiResponse<IGetCostCenter[]>) => {
        debugger
        this.costCenters = res.data || [];
        

        if (this.costCenters.length === 0) this.emptyTable = 'No Data Available';
      },
      error: () => { this.emptyTable = 'No Data Available'; }
    });
  }
  private GetCostCenterById(id: number): void {
    this.costCenterService.GetCostCenterById(id).subscribe({
      next: (res: IApiResponse<IAddCostCenter>) => {
        debugger
        if (res.data) {
          this.addCostCenter = res.data;
          this.fillFormForEdit(res.data);
        }
      },
      error: () => { 
        this.sharedService.handleResponse({ status: 500, message: 'Failed to load costCenter data', data: null, errors: [], errorCode: null });
      }
    });
  }

  fillFormForEdit(costCenter: IAddCostCenter): void {
    this.costCenterForm.patchValue({
      code: costCenter.code,
      name: costCenter.name,
      level: costCenter.level,
      notes: costCenter.notes,
      parentId: costCenter.parentId || 0
    });
  }

  // prepare FormData with required API keys and submit to backend
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

    const costCenterData : IAddCostCenter = {
      code: values.code ?? '',
      name: values.name ?? '',
      level: values.level ?? 0,
      notes: values.notes ?? '',
      costCenterType: values.costCenterType ?? '',
      parentId: values.parentId ?? 0
    };
    this.costCenterService.createCostCenter(costCenterData).subscribe({
      next: (res) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_add');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200)
          this.GetCostCenter();
      },
      error: (err) => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to create costCenter.', data: null, errors: [], errorCode: null });
      }
    });
  }

  editCostCenter(): void {
    const values = this.costCenterForm.value;

    const costCenterData : IAddCostCenter= {
      code: values.code ?? '',
      name: values.name ?? '',
      level: values.level ?? 0,
      costCenterType: values.costCenterType ?? '',
      notes: values.notes ?? '',
      parentId: values.parentId ?? 0
    };
debugger
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
        this.sharedService.handleResponse({ status: 500, message: 'Failed to update costCenter.', data: null, errors: [], errorCode: null });
      }
    });
  }

  // عند فتح المودال، احفظ رقم الشركة هنا
  openDeleteModal(costCenterId: number): void {
    this.selectedCostCenterId = costCenterId;
  }

  openEditModal(costCenterId: number): void {
    this.isEditMode = true;
    this.selectedCostCenterForEdit = costCenterId;
    debugger
    this.GetCostCenterById(costCenterId);
  }

  onDeleteCostCenter(costCenterId: number | null): void {
    if (costCenterId == null) return;
    debugger
    this.costCenterService.deleteCostCenter(costCenterId).subscribe({
      next: (res) => {
        debugger
        this.GetCostCenter(); // تحديث القائمة بعد الحذف
      },
      error: (err) => {
        this.GetCostCenter(); // تحديث القائمة حتى لو حدث خطأ
      }
    });
  }

  // simple client-side sort (kept)
  // sortData(sort: Sort) {
  //   const data = this.costCenters.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.costCenters = data;
  //     return;
  //   }
  //   this.costCenters = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'name':
  //         return compare(a.name, b.name, isAsc);
  //       case 'code':
  //         return compare(a.code, b.code, isAsc);
  //       case 'userName':
  //         return compare(a.userName, b.userName, isAsc);
  //       case 'phoneNumber':
  //         return compare(a.phoneNumber, b.phoneNumber, isAsc);
  //       default:
  //         return 0;
  //     }
  //   });
  // }

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
