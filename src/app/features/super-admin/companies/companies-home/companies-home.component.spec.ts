import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesHomeComponent } from './companies-home.component';

describe('CompaniesHomeComponent', () => {
  let component: CompaniesHomeComponent;
  let fixture: ComponentFixture<CompaniesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
