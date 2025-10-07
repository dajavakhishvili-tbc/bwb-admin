import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextDialog } from './text-dialog';

describe('TextDialog', () => {
  let component: TextDialog;
  let fixture: ComponentFixture<TextDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
