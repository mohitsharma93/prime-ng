import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';

import { BaseComponent } from "../../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take, takeUntil } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";

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
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService
  ) {
    super();
    this.setColumById();
    // this.orders$ = of(dummyData)
  }

  ngOnInit() {
    this.subjectService.holdBulkDataForNext$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res?.length) {
        console.log('res', res);
        this.orders$ = of(res);
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'ItemName', header: 'ITEM NAME'},
      { field: 'NetQuantity', header: 'QUANTITY'},
      { field: 'expandedRow', header: 'ORDER WISE QUANTITY'},
    ]
  }


  public cancelOrder(): void {
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
    const allOrderId: number[] = [];
    this.adminOrderService.bulkOrderAddtoAcceptService(allOrderId).subscribe(res => {
      if (res && res?.Status == 'OK') {
        this.backClicked();
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }
}