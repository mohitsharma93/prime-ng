import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-print-invoice-model',
  templateUrl: './print-invoice-model.component.html',
  styleUrls: ['./print-invoice-model.component.scss']
})
export class PrintInvoiceModelComponent implements OnInit {

  data: any;
  modelData: any;
  printData: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
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
}
