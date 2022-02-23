import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-print-model',
  templateUrl: './print-model.component.html',
  styleUrls: ['./print-model.component.scss']
})
export class PrintModelComponent implements OnInit {
  data: any;
  modelData: any;
  printData: any[] = [];
  headerData: {
    Date: string
    OrderCount: any
    SellerAddress: string
    SellerContact: string
    SellerName: string
    TotalOrder: any
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    debugger;
    this.migratePrintData(config.data);
    if (config.data.Item3) {
      this.headerData = config.data.Item3;
    }
  }

  ngOnInit() { }

  exportData() {
    window.print();
  }

  getPrint() {
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
  migratePrintData(data: any) {
    if (data && data.Item1) {
      this.printData = [...data.Item1];
      if (this.printData.length > 0) {
        for (let i = 0; i < this.printData.length; i++) {
          const item2List: any[] = data.Item2.filter((c: any) => c.ItemName === this.printData[i].ItemName);
          if (item2List.length > 0) {
            let orderQuantities: any[] = [];
            for (const i2 of item2List) {
              orderQuantities.push(` ${i2.OrderId} - ${i2.Quantity} `);
            }
            this.printData[i]['orderQuantities'] = orderQuantities;
          }
        }
        for (const item of this.printData) {
          const qunt: any[] = data.Item2.find((c: any) => c.ItemName === item.ItemName);

        }

      }

    }

  }

}


