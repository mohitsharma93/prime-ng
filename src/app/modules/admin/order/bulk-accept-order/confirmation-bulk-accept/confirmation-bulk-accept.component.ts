import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';

import { BaseComponent } from "../../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take } from "rxjs";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-admin-confirmation-bulk-accept',
  templateUrl: './confirmation-bulk-accept.component.html',
  styleUrls: ['./confirmation-bulk-accept.component.scss'],
})
export class ConfirmationBulkAcceptComponent extends BaseComponent implements OnInit {

  public columns: any[] = [];
  public orders$: Observable<any[]>;
  public selectedData: any[] = [];
  public cancelReasonControl: FormControl = new FormControl('', [ Validators.required ]);
  public cancelModelShow: boolean = false;

  constructor(
    private _location: Location,
  ) {
    super();
    this.setColumById();
    this.orders$ = of(dummyData)
  }

  ngOnInit() {

  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'SNo', header: 'S NO.'},
      { field: 'ItemName', header: 'ITEM NAME'},
      { field: 'Quantity', header: 'QUANTITY'},
      { field: 'OrderWiseQuantity', header: 'ORDER WISE QUANTITY'},
    ]
  }


  public cancelOrder(): void {
    console.log('in cancel order');
    this.backClicked();
  }

  public next() {
    if (this.selectedData && this.selectedData.length) {
      this.rejectCancelPopUp(true);
    }
  }

  public rejectCancelPopUp(hideShowCancelModel: boolean): void {
  this.cancelModelShow = hideShowCancelModel
  }

  public hitCancelOrderApi() {
    console.log('in bulk-accept cancel order')
  }

  public acceptBulkOrder() {
    console.log('in accept bulk order')
  }
}