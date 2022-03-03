import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInvoiceMultipleModelComponent } from './print-invoice-multiple-model.component';

describe('PrintInvoiceMultipleModelComponent', () => {
  let component: PrintInvoiceMultipleModelComponent;
  let fixture: ComponentFixture<PrintInvoiceMultipleModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintInvoiceMultipleModelComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInvoiceMultipleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
