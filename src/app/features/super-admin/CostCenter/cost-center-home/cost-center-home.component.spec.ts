import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterHomeComponent } from './cost-center-home.component';

describe('CostCenterHomeComponent', () => {
  let component: CostCenterHomeComponent;
  let fixture: ComponentFixture<CostCenterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCenterHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCenterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
