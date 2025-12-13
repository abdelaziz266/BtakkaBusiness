import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFinishingInspectionRequestComponent } from './get-finishing-inspection-request.component';

describe('GetFinishingInspectionRequestComponent', () => {
  let component: GetFinishingInspectionRequestComponent;
  let fixture: ComponentFixture<GetFinishingInspectionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetFinishingInspectionRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetFinishingInspectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
