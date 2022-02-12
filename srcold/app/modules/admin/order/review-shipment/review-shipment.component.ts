import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';

import { Observable, of, take } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { dummyData } from "./dummy";
import { BaseComponent } from "../../base.component";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";

@Component({
  selector: 'app-admin-confirmation-bulk-accept',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss'],
})
export class ReviewShipmentComponent extends BaseComponent implements OnInit {

  public allIds: number[] = [];
  public columns: any[] = [];
  public orders$: Observable<any[]>;

  constructor(
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService
  ) {
    super();
    this.setColumById();
    this.orders$ = of(dummyData)
  }

  ngOnInit() {
    this.subjectService.holdIdsForCreateShipment$.pipe(take(1)).subscribe(res => {
      if (res && res?.length) {
        this.allIds = res;
      }
    })
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

  public createShipment(): void {
    console.log('in createShipment');
    this.adminOrderService.addToShipmentService(this.allIds).subscribe(res => {
      if (res && res.Status == 'OK') {
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }
}