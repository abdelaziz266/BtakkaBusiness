import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetContractRequestComponent } from './get-contract-request.component';

describe('GetContractRequestComponent', () => {
  let component: GetContractRequestComponent;
  let fixture: ComponentFixture<GetContractRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetContractRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetContractRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
