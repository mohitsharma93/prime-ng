import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-print-invoice-multiple-model',
  templateUrl: './print-invoice-multiple-model.component.html',
  styleUrls: ['./print-invoice-multiple-model.component.scss']
})
export class PrintInvoiceMultipleModelComponent implements OnInit {

  listData: {
    AmountInWord: string
    BuyerAddress1: string
    BuyerAddress2: string
    BuyerContact: any
    BuyerGSTNo: any
    BuyerName: string
    BuyerPanNO: any
    BuyerState: string
    CGST: any
    IGST: any
    InvoiceDate: string
    InvoiceNo: any
    OrderDate: string
    OrderId: any
    PlaceOfDelivery: any
    PlaceOfSupply: any
    Remarks: any
    RoundOff: any
    SGST: any
    SellerAddress1: string
    SellerAddress2: string
    SellerAddress3: string
    SellerContact: string
    SellerGSTNo: any
    SellerName: string
    SellerPanNO: any
    TaxableAmount: any
    TotalAmount: any
    _invoiceItemListDTO: any[],
  }[];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    if (config.data) {
      this.listData = config.data;
    }
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
