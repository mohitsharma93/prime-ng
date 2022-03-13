import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintShipmentModelComponent } from './print-shipment-model.component';

describe('PrintShipmentModelComponent', () => {
  let component: PrintShipmentModelComponent;
  let fixture: ComponentFixture<PrintShipmentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintShipmentModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintShipmentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
