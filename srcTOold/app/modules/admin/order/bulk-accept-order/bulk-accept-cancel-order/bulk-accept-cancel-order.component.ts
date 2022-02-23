import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';

import { BaseComponent } from "../../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take } from "rxjs";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-admin-bulk-accept-cancel-order',
  templateUrl: './bulk-accept-cancel-order.component.html',
  styleUrls: ['./bulk-accept-cancel-order.component.scss'],
})
export class BulkAcceptCancelOrderComponent extends BaseComponent implements OnInit {

  public columns: any[] = [];
  public orders$: Observable<any[]>;
  public selectedData: any[] = [];
  public cancelReasonControl: FormControl = new FormControl('', [ Validators.required ]);
  public cancelModelShow: boolean = false;

  constructor(
    private _location: Location,
    private router: Router
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
      { field: 'SNo', header: 'S.NO.'},
      { field: 'BuyerName', header: 'BUYER NAME'},
      { field: 'OrderID', header: 'ORDER ID'},
      { field: 'NoOfItem', header: 'NO. OF ITEMS'},
      { field: 'OrderAmount', header: 'ORDER AMOUNT' },
      { field: 'Status', header: 'STATUS' },
    ]
  }


  public cancelOrder(): void {
    console.log('in cancel order');
    if (this.selectedData && this.selectedData.length) {
      console.log('reason cancel', this.cancelReasonControl.value);
      // here call canceledSelectedService api for cancel and re
      this.rejectCancelPopUp(true);
    }
  }

  public next() {
   
    this.router.navigate(['/admin', 'order', 'bulk-accept', 'confirm']);
  }

  public rejectCancelPopUp(hideShowCancelModel: boolean): void {
  this.cancelModelShow = hideShowCancelModel
  }

  public hitCancelOrderApi() {
    console.log('in hitCancelOrderApi')
  }

  public checkReason() {
    if (this.cancelReasonControl.value.length) {
      this.rejectCancelPopUp(false)
    } else {
      this.cancelReasonControl.markAllAsTouched();
    }
  }
}