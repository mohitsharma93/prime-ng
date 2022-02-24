import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';

import { BaseComponent } from "../../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take } from "rxjs";
import { Router } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";

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
    private router: Router,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService
  ) {
    super();
    this.setColumById();
    // this.orders$ = of(dummyData)
  }

  ngOnInit() {
    this.subjectService.holdBulkOrderIdsForCancel$.subscribe(res => {
      if (res && res?.length) {
        this.getBulkCancelOrderDetail(res);
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'BuyerName', header: 'BUYER NAME'},
      { field: 'OrderId', header: 'ORDER ID'},
      { field: 'NOOfItem', header: 'NO. OF ITEMS'},
      { field: 'OrderAmount', header: 'ORDER AMOUNT' },
      { field: 'Status', header: 'STATUS' },
    ]
  }

  public getBulkCancelOrderDetail(ids: number[]) {
    this.adminOrderService
      .bulkCancelOrderDetail(ids)
      .subscribe((res) => {
        if (res && res.Status == 'OK') {
          this.orders$ = of(res?.Data)
        } else {
          this.toasterService.error(res?.ErrorMessage);
        }
      });
  }


  public cancelOrder(): void {
    console.log('in cancel order');
    if (this.selectedData && this.selectedData.length) {
      console.log('reason cancel', this.cancelReasonControl.value);
      this.rejectCancelPopUp(true);
    } else {
      this.toasterService.info('Select order first through checkbox for cancel');
    }
  }

  public next() {
    this.subjectService.setHoldBulkOrderIdsForCancel(null)
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
      this.cancelSelected();
    } else {
      this.cancelReasonControl.markAllAsTouched();
    }
  }

  public cancelSelected() {
    if (this.selectedData && this.selectedData.length) {
      const allOrderId = this.selectedData.map(o => o.OrderId);
      this.adminOrderService.canceledSelectedService(this.cancelReasonControl.value, allOrderId).subscribe(res => {
        if (res && res?.Status == 'OK') {
          this.rejectCancelPopUp(false);
          this.next();
        } else {
          this.toasterService.error(res?.ErrorMessage);
        }
      });
    } else {
      this.toasterService.info('Please select order through checkbox for cancelled')
    }
  }
}