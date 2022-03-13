import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintModelComponent } from './print-model.component';

describe('PrintModelComponent', () => {
  let component: PrintModelComponent;
  let fixture: ComponentFixture<PrintModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
