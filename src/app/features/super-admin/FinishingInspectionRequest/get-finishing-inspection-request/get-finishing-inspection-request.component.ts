import { Component } from '@angular/core';
import { CollapseHeaderComponent } from '../../../common/collapse-header/collapse-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';
import { CustomPaginationComponent } from '../../../../shared/components/custom-pagination/custom-pagination.component';
import { MatSortModule } from '@angular/material/sort';

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
    MatSortModule
  ],
  templateUrl: './get-finishing-inspection-request.component.html',
  styleUrl: './get-finishing-inspection-request.component.scss'
})
export class GetFinishingInspectionRequestComponent {

}
