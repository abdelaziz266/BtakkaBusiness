import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { routes } from '../../../../shared/routes/routes';
import { CompanyService } from '../../../../core/services/company.service';
import { IGetCompanyDto } from '../../../../core/models/company.dto';
import { IApiResponse, IApiResponseWithList } from '../../../../core/models/shared.dto';
import { Sort } from '@angular/material/sort';
import { RoleService } from '../../../../core/services/role.service';
import { ICompanyRoleClaimDto } from '../../../../core/models/role.dto';
import { SharedService } from '../../../../core/services/shared.service';
import { IGetServiceCategoryDto } from '../../../../core/models/serviceCategory.dto';
import { ServiceCategoryService } from '../../../../core/services/service-category.service';

@Component({
  selector: 'app-companies-home',
  standalone: true,
  imports: [CollapseHeaderComponent, ReactiveFormsModule, SelectModule, MultiSelectModule, FormsModule, CommonModule, BsDatepickerModule, RouterLink, CustomPaginationComponent, MatSortModule],
  templateUrl: './companies-home.component.html',
  styleUrl: './companies-home.component.scss'
})
export class CompaniesHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('offcanvasAdd', { static: false }) offcanvasAdd!: ElementRef;
  @ViewChild('offcanvasEdit', { static: false }) offcanvasEdit!: ElementRef;

  routes = routes;
  companies: IGetCompanyDto[] = [];
  company: IGetCompanyDto = {
    id: 0,
    name: '',
    code: '',
    promoCode: '',
    logo: '',
    referralCompanyId: 0,
    userName: '',
    phoneNumber: '',
    countryCode: '',
    address: '',
    unitsCount: 0,
    engineersCount: 0,
    categoryIds: [],
    claimIds: [],
    serviceCategoryIds: [],
  };
  companyRoles: ICompanyRoleClaimDto[] = [];
  getServiceCategoryDto: IGetServiceCategoryDto[] = [];
  selectedRoles: boolean[] = [];
  expandedRoles: boolean[] = [];
  companyForm!: FormGroup;
  password: boolean[] = [false];
  previewUrl: string | ArrayBuffer | null = null;
  emptyTable = '';
  selectedCompanyId: number | null = null;
  isEditMode: boolean = false;
  selectedCompanyForEdit: number | null = null;
  categories: any[] = [
    { id: 1, name: 'Interior Design' },
    { id: 2, name: 'Architecture' },
    { id: 3, name: 'Construction' },
    { id: 4, name: 'Furniture' },
    { id: 5, name: 'Decoration' }
  ];
  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private roleService: RoleService,
    private sharedService: SharedService,
    private serviceCategoryService: ServiceCategoryService
  ) { }

  ngOnInit(): void {
    this.GetCompany();
    this.getCompanyRoleClaims();
    this.getServiceCategories();

    // internal form controls (keep lowercase for template compatibility)
    this.companyForm = this.fb.group({
      // keep keys used in template, we'll map them to the API names on submit
      name: ['', Validators.required],
      code: ['', Validators.required],
      about: ['', Validators.required],
      unitsCount: [0, [Validators.required, Validators.min(0)]],
      engineersCount: [0, [Validators.required, Validators.min(0)]],
      userName: ['', Validators.required],
      address: ['', Validators.required],
      // require phone to start with "01" and be 11 digits total
      phoneNumber: ['', [Validators.required, Validators.pattern(/^01\d{9}$/)]],
      promoCode: ['', Validators.required],
      referralCompanyId: [null],
      countryCode: ['+20', Validators.required],
      categoryIds: [[]],
      serviceCategoryIds: [[], Validators.required],
      ClaimIds: [[]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      image: [null]
    }, { validators: this.groupValidator.bind(this) });
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
    this.selectedCompanyForEdit = null;
    this.companyForm.reset({
      name: '',
      code: '',
      about: '',
      unitsCount: 0,
      engineersCount: 0,
      userName: '',
      address: '',
      phoneNumber: '',
      promoCode: '',
      referralCompanyId: null,
      countryCode: '+20',
      categoryIds: [],
      serviceCategoryIds: [],
      ClaimIds: [],
      password: '',
      confirmPassword: '',
      image: null
    });
    this.previewUrl = null;
    this.selectedRoles = new Array(this.companyRoles.length).fill(false);
    this.expandedRoles = new Array(this.companyRoles.length).fill(false);
    this.password = [false];
  }

  // composite validator: password match + roles/claims rules
  groupValidator(form: FormGroup) {
    const pwdErr = this.passwordMatchValidator(form);
    const rcErr = this.rolesClaimsValidator(form);
    const merged: any = { ...(pwdErr ?? {}), ...(rcErr ?? {}) };
    return Object.keys(merged).length ? merged : null;
  }

  // ensure at least one parent selected; for each selected parent that has claims -> at least one child selected
  rolesClaimsValidator(form: FormGroup) {
    if (!this.companyRoles || this.companyRoles.length === 0) return null;

    const anyRoleSelected = (this.selectedRoles || []).some(r => r === true);
    if (!anyRoleSelected) {
      return { noRoleSelected: true };
    }

    const selectedClaimIds: number[] = form.get('ClaimIds')?.value || [];

    for (let i = 0; i < this.companyRoles.length; i++) {
      if (!this.selectedRoles[i]) continue;
      const roleClaims = (this.companyRoles[i].claims || []).map(c => c.id);
      // if role has no children -> OK, no child required
      if (!roleClaims || roleClaims.length === 0) continue;
      const hasChildSelected = selectedClaimIds.some(id => roleClaims.includes(id));
      if (!hasChildSelected) {
        return { missingClaimsForSelectedRole: true };
      }
    }

    return null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.sharedService.handleResponse({ status: 400, message: 'Invalid file type', data: null, errors: [], errorCode: null });
      return;
    }
    if (file.size > 1024 * 1024) {
      this.sharedService.handleResponse({ status: 400, message: 'Max image size is 1MB.', data: null, errors: [], errorCode: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.companyForm.patchValue({ image: file });
    };
    reader.readAsDataURL(file);
  }

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }

  private GetCompany(): void {
    this.companyService.GetCompany().subscribe({
      next: (res: IApiResponseWithList<IGetCompanyDto[]>) => {
        this.companies = res.data?.data || [];
        if (this.companies.length === 0) this.emptyTable = 'No Data Available';
      },
      error: () => { this.emptyTable = 'No Data Available'; }
    });
  }
  private GetCompanyById(id: number): void {
    this.companyService.GetCompanyById(id).subscribe({
      next: (res: IApiResponse<IGetCompanyDto>) => {
        if (res.data) {
          this.company = res.data;
          this.fillFormForEdit(res.data);
        }
      },
      error: () => { 
        this.sharedService.handleResponse({ status: 500, message: 'Failed to load company data', data: null, errors: [], errorCode: null });
      }
    });
  }

  fillFormForEdit(company: IGetCompanyDto): void {
    this.companyForm.patchValue({
      name: company.name,
      code: company.code,
      about: '',
      unitsCount: company.unitsCount,
      engineersCount: company.engineersCount,
      userName: company.userName,
      address: company.address,
      phoneNumber: '0' + company.phoneNumber,
      promoCode: company.promoCode,
      referralCompanyId: company.referralCompanyId,
      countryCode: company.countryCode,
      categoryIds: company.categoryIds,
      serviceCategoryIds: company.serviceCategoryIds,
      ClaimIds: company.claimIds,
      password: '',
      confirmPassword: ''
    });
    
    if (company.logo) {
      this.previewUrl = company.logo;
    }

    // Update selected roles based on categoryIds (role IDs)
    if (company.categoryIds && company.categoryIds.length > 0) {
      this.companyRoles.forEach((role, index) => {
        this.selectedRoles[index] = company.categoryIds.includes(role.id);
      });
    }
  }

  private getCompanyRoleClaims(): void {
    this.roleService.getCompanyRoleClaims().subscribe({
      next: (res) => {
        this.companyRoles = res.data ?? [];
        this.selectedRoles = new Array(this.companyRoles.length).fill(false);
        this.expandedRoles = new Array(this.companyRoles.length).fill(false);
      },
      error: () => { this.companyRoles = []; }
    });
  }
  private getServiceCategories(): void {
    this.serviceCategoryService.GetServiceCategories().subscribe({
      next: (res) => {

        this.getServiceCategoryDto = res.data ?? [];
        this.selectedRoles = new Array(this.companyRoles.length).fill(false);
        this.expandedRoles = new Array(this.companyRoles.length).fill(false);
      },
      error: () => { this.companyRoles = []; }
    });
  }

  // parent checkbox toggles
  toggleRole(roleIndex: number): void {
    this.selectedRoles[roleIndex] = !this.selectedRoles[roleIndex];

    const currentClaims: number[] = this.companyForm.get('ClaimIds')?.value || [];
    const currentCategories: string[] = this.companyForm.get('categoryIds')?.value || [];
    const roleClaimIds: number[] = (this.companyRoles[roleIndex].claims || []).map(c => c.id);
    const roleId: string = this.companyRoles[roleIndex].id;

    if (this.selectedRoles[roleIndex]) {
      // add role ID to categoryIds
      if (!currentCategories.includes(roleId)) {
        currentCategories.push(roleId);
      }
      // add all children claims of this role (no duplicates)
      const newClaims = Array.from(new Set([...currentClaims, ...roleClaimIds]));
      this.companyForm.patchValue({ 
        categoryIds: currentCategories,
        ClaimIds: newClaims 
      });
    } else {
      // remove role ID from categoryIds
      const filteredCategories = currentCategories.filter(id => id !== roleId);
      // remove all children claims of this role
      const filteredClaims = currentClaims.filter(id => !roleClaimIds.includes(id));
      this.companyForm.patchValue({ 
        categoryIds: filteredCategories,
        ClaimIds: filteredClaims 
      });
    }

    this.companyForm.updateValueAndValidity();
  }

  toggleRoleExpand(roleIndex: number): void {
    this.expandedRoles[roleIndex] = !this.expandedRoles[roleIndex];
  }

  isClaimSelected(roleIndex: number, claimId: number): boolean {
    const currentClaims: number[] = this.companyForm.get('ClaimIds')?.value || [];
    return currentClaims.includes(claimId);
  }

  toggleClaim(roleIndex: number, claimId: number): void {
    const currentClaims: number[] = this.companyForm.get('ClaimIds')?.value || [];
    const currentCategories: string[] = this.companyForm.get('categoryIds')?.value || [];
    const idx = currentClaims.indexOf(claimId);
    if (idx > -1) currentClaims.splice(idx, 1);
    else currentClaims.push(claimId);

    this.companyForm.patchValue({ ClaimIds: currentClaims });

    // if any child of role selected -> ensure parent marked selected and role ID added; else unmark and remove
    const roleClaimIds = (this.companyRoles[roleIndex].claims || []).map(c => c.id);
    const hasAnyForRole = currentClaims.some(id => roleClaimIds.includes(id));
    const roleId: string = this.companyRoles[roleIndex].id;
    
    if (hasAnyForRole) {
      this.selectedRoles[roleIndex] = true;
      if (!currentCategories.includes(roleId)) {
        currentCategories.push(roleId);
        this.companyForm.patchValue({ categoryIds: currentCategories });
      }
    } else {
      this.selectedRoles[roleIndex] = roleClaimIds.length === 0 && this.selectedRoles[roleIndex];
      const filteredCategories = currentCategories.filter(id => id !== roleId);
      this.companyForm.patchValue({ categoryIds: filteredCategories });
    }

    this.companyForm.updateValueAndValidity();
  }

  // prepare FormData with required API keys and submit to backend
  submitForm(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.companyForm.updateValueAndValidity();
      return;
    }

    if (this.isEditMode && this.selectedCompanyForEdit) {
      this.editCompany();
    } else {
      this.createCompany();
    }
  }

  createCompany(): void {

    const values = this.companyForm.value;

    const ClaimIds: number[] = values.ClaimIds || [];
    const CategoryIds: string[] = values.categoryIds || [];
    const ServiceCategoryIds: number[] = values.serviceCategoryIds || [];

    const fd = new FormData();

    const img: File | null = values.image ?? null;
    if (img) {
      fd.append('profilePicture', img, img.name);
    } else {
      fd.append('profilePicture', '');
    }

    fd.append('name', values.name ?? '');
    fd.append('code', values.code ?? '');
    fd.append('about', values.about ?? '');
    fd.append('UnitsCount', String(values.unitsCount ?? 0));
    fd.append('EngineersCount', String(values.engineersCount ?? 0));
    fd.append('PromoCode', values.promoCode ?? '');
    fd.append('ReferralCompanyId', values.referralCompanyId != null ? String(values.referralCompanyId) : '');
    fd.append('UserName', values.userName ?? '');
    fd.append('Address', values.address ?? '');

    const rawPhone: string = values.phoneNumber ?? '';
    const phoneToSend = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    fd.append('CountryCode', values.countryCode ?? '+20');
    fd.append('PhoneNumber', phoneToSend);

    fd.append('Password', values.password ?? '');

    CategoryIds.forEach(id => fd.append('CategoryIds', id));
    ServiceCategoryIds.forEach(id => fd.append('ServiceCategoryIds', String(id)));
    ClaimIds.forEach(id => fd.append('ClaimIds', String(id)));

    const obj: any = {};
    fd.forEach((value, key) => {
      if (!obj[key]) obj[key] = [];
      obj[key].push(value);
    });

    this.companyService.createCompany(fd).subscribe({
      next: (res) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_add');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200)
          this.GetCompany();
      },
      error: (err) => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to create company.', data: null, errors: [], errorCode: null });
      }
    });
  }

  editCompany(): void {
    const values = this.companyForm.value;

    const ClaimIds: number[] = values.ClaimIds || [];
    const CategoryIds: string[] = values.categoryIds || [];
    const ServiceCategoryIds: number[] = values.serviceCategoryIds || [];

    const fd = new FormData();

    const img: File | null = values.image ?? null;
    if (img) {
      fd.append('profilePicture', img, img.name);
    }

    fd.append('name', values.name ?? '');
    fd.append('code', values.code ?? '');
    fd.append('about', values.about ?? '');
    fd.append('UnitsCount', String(values.unitsCount ?? 0));
    fd.append('EngineersCount', String(values.engineersCount ?? 0));
    fd.append('PromoCode', values.promoCode ?? '');
    fd.append('ReferralCompanyId', values.referralCompanyId != null ? String(values.referralCompanyId) : '');
    fd.append('UserName', values.userName ?? '');
    fd.append('Address', values.address ?? '');

    const rawPhone: string = values.phoneNumber ?? '';
    const phoneToSend = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    fd.append('CountryCode', values.countryCode ?? '+20');
    fd.append('PhoneNumber', phoneToSend);

    if (values.password) {
      fd.append('Password', values.password);
    }

    CategoryIds.forEach(id => fd.append('CategoryIds', id));
    ServiceCategoryIds.forEach(id => fd.append('ServiceCategoryIds', String(id)));
    ClaimIds.forEach(id => fd.append('ClaimIds', String(id)));
debugger
    this.companyService.update(Number(this.selectedCompanyForEdit),fd).subscribe({
      next: (res) => {
        if (res.status === 200) {
          const offcanvas = document.getElementById('offcanvas_edit');
          if (offcanvas) {
            (window as any).bootstrap?.Offcanvas.getOrCreateInstance(offcanvas)?.hide();
          }
        }
        this.sharedService.handleResponse(res);
        if (res.status === 200) {
          this.GetCompany();
          this.resetForm();
        }
      },
      error: (err) => {
        this.sharedService.handleResponse({ status: 500, message: 'Failed to update company.', data: null, errors: [], errorCode: null });
      }
    });
  }

  // عند فتح المودال، احفظ رقم الشركة هنا
  openDeleteModal(companyId: number): void {
    this.selectedCompanyId = companyId;
  }

  openEditModal(companyId: number): void {
    this.isEditMode = true;
    this.selectedCompanyForEdit = companyId;
    this.GetCompanyById(companyId);
  }

  onDeleteCompany(companyId: number | null): void {
    if (companyId == null) return;
    this.companyService.deleteCompany(companyId).subscribe({
      next: (res) => {
        this.GetCompany(); // تحديث القائمة بعد الحذف
      },
      error: (err) => {
        this.GetCompany(); // تحديث القائمة حتى لو حدث خطأ
      }
    });
  }

  // simple client-side sort (kept)
  sortData(sort: Sort) {
    const data = this.companies.slice();
    if (!sort.active || sort.direction === '') {
      this.companies = data;
      return;
    }
    this.companies = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'code':
          return compare(a.code, b.code, isAsc);
        case 'userName':
          return compare(a.userName, b.userName, isAsc);
        case 'phoneNumber':
          return compare(a.phoneNumber, b.phoneNumber, isAsc);
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
