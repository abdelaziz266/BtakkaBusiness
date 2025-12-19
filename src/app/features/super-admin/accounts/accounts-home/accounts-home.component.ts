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
import { IGetAccount, IAddAccount } from '../../../../core/models/account.dto';
import { AccountService } from '../../../../core/services/account.service';
@Component({
  selector: 'app-accounts-home',
  standalone: true,
  imports: [CollapseHeaderComponent, ReactiveFormsModule, SelectModule, MultiSelectModule, FormsModule, CommonModule, BsDatepickerModule, RouterLink, CustomPaginationComponent, MatSortModule],
  templateUrl: './accounts-home.component.html',
  styleUrl: './accounts-home.component.scss'
})
export class AccountsHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasAdd', { static: false }) offcanvasAdd!: ElementRef;
  @ViewChild('offcanvasEdit', { static: false }) offcanvasEdit!: ElementRef;

  routes = routes;
  accounts: IGetAccount[] = [];
  filteredAccounts: IGetAccount[] = [];
  account: IGetAccount = {
    id: 0,
    accountCode: '',
    accountName: '',
    level: 0,
    closingType: '',
    accountType: '',
    notes: '',
    parentCode: '',
    parentName: '',
    parentId: 0
  };
  accountForm!: FormGroup;
  emptyTable = '';
  selectedAccountId: number | null = null;
  isEditMode: boolean = false;
  selectedAccountForEdit: number | null = null;

  // Pagination
  rowCount = 10;
  pageNumber = 1;
  pagesCount = 0;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.GetAccount();
    // Account form matching API structure
    this.accountForm = this.fb.group({
      accountCode: ['', Validators.required],
      accountName: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]],
      closingType: ['BalanceSheet', Validators.required],
      accountType: ['Main', Validators.required],
      notes: [''],
      parentId: [null]
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
    this.selectedAccountForEdit = null;
    this.filteredAccounts = [];
    this.accountForm.reset({
      accountCode: '',
      accountName: '',
      level: 1,
      closingType: 'BalanceSheet',
      accountType: 'Main',
      notes: '',
      parentId: null
    });
    this.accountForm.markAsUntouched();
    this.accountForm.markAsPristine();
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNumber = event.pageNumber;
    this.rowCount = event.rowCount;
    this.GetAccount();
  }

  private GetAccount(): void {
    this.accountService.GetAccount(this.pageNumber, this.rowCount).subscribe({
      next: (res: IApiResponseWithList<IGetAccount>) => {
        this.accounts = res.data.data;
        this.pagesCount = res.data.pagesCount || 0;
        if (this.accounts.length === 0) this.emptyTable = 'No Data Available';
      },
      error: (err) => { 
        this.emptyTable = 'No Data Available';
        this.sharedService.handleError(err);
      }
    });
  }
  private GetAccountById(id: number): void {
    this.accountService.GetAccountById(id).subscribe({
      next: (res: IApiResponse<IGetAccount>) => {
        if (res.data) {
          this.account = res.data;
          this.fillFormForEdit(res.data);
        }
      },
      error: () => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to load account data', data: null, errors: [], errorCode: null });
      }
    });
  }

  fillFormForEdit(account: IGetAccount): void {
    this.accountForm.patchValue({
      accountCode: account.accountCode,
      accountName: account.accountName,
      level: account.level,
      closingType: account.closingType,
      accountType: account.accountType,
      notes: account.notes,
      parentId: account.parentId || null
    });
  }

  // prepare FormData with required API keys and submit to backend
  submitForm(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.accountForm.updateValueAndValidity();
      return;
    }

    if (this.isEditMode && this.selectedAccountForEdit) {
      this.editAccount();
    } else {
      this.createAccount();
    }
  }

  createAccount(): void {
    const values = this.accountForm.value;

    const accountData: IAddAccount = {
      accountCode: values.accountCode ?? '',
      accountName: values.accountName ?? '',
      level: values.level ?? 1,
      closingType: values.closingType ?? 'BalanceSheet',
      accountType: values.accountType ?? 'Main',
      notes: values.notes ?? '',
      parentId: values.parentId ?? null
    };

    this.accountService.createAccount(accountData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_add');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200) {
          this.GetAccount();
          this.resetForm();
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({
          status: 500,
          message: 'Failed to create account.',
          data: null,
          errors: [],
          errorCode: null
        });
      }
    });
  }

  editAccount(): void {
    const values = this.accountForm.value;

    const accountData: IAddAccount = {
      accountCode: values.accountCode ?? '',
      accountName: values.accountName ?? '',
      level: values.level ?? 1,
      closingType: values.closingType ?? 'BalanceSheet',
      accountType: values.accountType ?? 'Main',
      notes: values.notes ?? '',
      parentId: values.parentId ?? null
    };

    this.accountService.update(Number(this.selectedAccountForEdit), accountData).subscribe({
      next: (res) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_edit');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200) {
          this.GetAccount();
          this.resetForm();
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to update account.', data: null, errors: [], errorCode: null });
      }
    });
  }

  // عند فتح المودال، احفظ رقم الشركة هنا
  openDeleteModal(accountId: number): void {
    this.selectedAccountId = accountId;
  }

  openEditModal(accountId: number): void {
    this.isEditMode = true;
    this.selectedAccountForEdit = accountId;
    // فلترة الـ accounts لإزالة الـ account الحالي من قائمة الـ parent
    this.filteredAccounts = this.accounts.filter(acc => acc.id !== accountId);
    this.GetAccountById(accountId);
  }

  onDeleteAccount(accountId: number | null): void {
    if (accountId == null) return;
    this.accountService.deleteAccount(accountId).subscribe({
      next: (res) => {
        this.GetAccount();
      },
      error: (err) => {
        this.GetAccount();
      }
    });
  }

  sortData(sort: any) {
    const data = this.accounts.slice();
    if (!sort.active || sort.direction === '') {
      this.accounts = data;
      return;
    }
    this.accounts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.accountName, b.accountName, isAsc);
        case 'companyCode':
          return compare(a.accountCode, b.accountCode, isAsc);
        case 'userName':
          return compare(a.accountType, b.accountType, isAsc);
        case 'phoneNumber':
          return compare(a.closingType, b.closingType, isAsc);
        default:
          return 0;
      }
    });
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
