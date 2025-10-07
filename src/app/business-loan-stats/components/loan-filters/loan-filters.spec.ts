import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanFilters } from './loan-filters';

describe('LoanFilters', () => {
  let component: LoanFilters;
  let fixture: ComponentFixture<LoanFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
