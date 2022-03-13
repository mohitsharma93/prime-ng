import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-print-shipment-model',
  templateUrl: './print-shipment-model.component.html',
  styleUrls: ['./print-shipment-model.component.scss']
})
export class PrintShipmentModelComponent implements OnInit {

  data: {
    SellerAddress: string,
    SellerContactNo: string,
    SellerName: string,
    ShipmentDate: string,
    ShipmentId: any
    TotalDispatchValue: any
    printShipmentBuyeListDTO: any[]
    printShipmentItemListDTO: any[],
    totalOrder: any
  };
  modelData: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.data = config.data;
    console.log(this.data);
  }

  ngOnInit(): void {

  }

   public getPrint() {
    var printHtml: any = this.document.getElementById('print-docs');
    var currentPage = document.body.innerHTML;
    let elementPage = `
      <html>
        <head><title>Test</title></head>
        <body>${printHtml.outerHTML}</body>
      </html>
    `;
    document.body.innerHTML = elementPage;
    window.print();
    document.body.innerHTML = currentPage;
    window.location.reload();
  }

   public getOrderIdAndQuantity(data: any[]): any[] {
    let value: any[] = [];
    data.forEach((item: any) => {
      value.push(`${item.OrderId}-${item.Quantity}`)
    });
    return value;
  }

}
