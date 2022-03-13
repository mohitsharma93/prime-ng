import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInvoiceModelComponent } from './print-invoice-model.component';

describe('PrintInvoiceModelComponent', () => {
  let component: PrintInvoiceModelComponent;
  let fixture: ComponentFixture<PrintInvoiceModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInvoiceModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInvoiceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
