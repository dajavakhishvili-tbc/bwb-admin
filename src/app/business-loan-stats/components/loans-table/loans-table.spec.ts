import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansTable } from './loans-table';

describe('LoansTable', () => {
  let component: LoansTable;
  let fixture: ComponentFixture<LoansTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
