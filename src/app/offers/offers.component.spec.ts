import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OffersComponent } from './offers.component';

describe('OffersComponent', () => {
  let component: OffersComponent;
  let fixture: ComponentFixture<OffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial offers', () => {
    expect(component.offers().length).toBeGreaterThan(0);
  });

  it('should open dialog when add button is clicked', () => {
    component.openAddDialog();
    expect(component.isDialogOpen()).toBe(true);
    expect(component.dialogType()).toBe('add');
  });
}); 