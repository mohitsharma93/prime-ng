import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';
import { Observable, of, take } from "rxjs";
import { BaseComponent } from "../../base.component";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-confirmation-bulk-accept',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss'],
})
export class ReviewShipmentComponent extends BaseComponent implements OnInit {

  public allIds: number[] = [];
  public columns: any[] = [];
  public orders$: Observable<{ Item1: any[], Item2: any}>;

  constructor(
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private router: Router
  ) {
    super();
    this.setColumById();
  }

  ngOnInit() {  
    this.subjectService.holdIdsForCreateShipment$.pipe(take(1)).subscribe(res => {
      if (res && res?.length) {
        this.allIds = res;
        this.getReviewShipmentData(res);
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'ItemName', header: 'ITEM NAME'},
      { field: 'Quantity', header: 'QUANTITY'},
      { field: 'OrderQuantityList', header: 'ORDER WISE QUANTITY'},
    ]
  }

  public getReviewShipmentData(allIds:number[]): void {
    this.adminOrderService.getReviewShipmentService(allIds).subscribe(res => {
      console.log('getReviewShipmentData', res);
      if (res && res.Status == 'OK') {
        this.orders$ = of(res.Data);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }

  public getSaveFilterRedirection() {
    let filter: any = null ;
    this.subjectService.saveFilterOnRedirection$.pipe(take(1)).subscribe(res => {
      console.log('res saveFilterOnRedirection', res)
      filter = res;
    });
    return filter;
  }

  public createShipment(): void {
    this.adminOrderService.addBulkToShipmentService(this.allIds).subscribe(res => {
      console.log(res);
      if (res && res.Status == 'OK') {
        // let filter = this.getSaveFilterRedirection();
        // if (filter && Object.keys(filter).length) {
        //   filter.topFilter.orderStatusId = 2
        //   this.subjectService.setSaveFilterOnRedirection(filter);
        //   this.backClicked();
        // }
        this.subjectService.setOrderDetail({
          ...res.Data,
          orderStatusId: 3,
          showElse: true,
          Status: 'Shipped'
        });
        this.router.navigate([
          '/admin',
          'order',
          'detail',
          res.Data?.ShipmentId,
        ]);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }
}