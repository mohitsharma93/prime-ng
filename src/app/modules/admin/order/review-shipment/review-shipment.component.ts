import { Component, OnDestroy, OnInit } from "@angular/core"
import { Location } from '@angular/common';
import { Observable, of, Subscription, take } from "rxjs";
import { BaseComponent } from "../../base.component";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";
import { Router } from "@angular/router";
import { PrintShipmentModelComponent } from "src/app/modules/print-shipment-model/print-shipment-model.component";
import { DialogService } from "primeng/dynamicdialog";
import { DataService } from "src/app/shared/services/data.service";
import { ConfirmationService } from "src/app/shared/services/confirmation.service";
import { ConfirmationModelComponent } from "src/app/modules/confirmation-model/confirmation-model.component";

@Component({
  selector: 'app-admin-confirmation-bulk-accept',
  templateUrl: './review-shipment.component.html',
  styleUrls: ['./review-shipment.component.scss'],
})
export class ReviewShipmentComponent extends BaseComponent implements OnInit, OnDestroy {

  public allIds: number[] = [];
  public columns: any[] = [];
  public orders$: Observable<{ Item1: any[], Item2: any }>;
  public subscription: Subscription;
  
  constructor(
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private dialogService: DialogService,
    private router: Router,
    private confirmationService: ConfirmationService
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
    this.subscription = this.confirmationService.getConfirmation().subscribe((response: any) => {
      if (response.status) {
        if (response.action === 'create_Shipment_order') {
          this.createShipment();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public backClicked(): void {
    if (this.allIds && this.allIds.length) {
      console.log('ids', this.allIds)
      this.subjectService.setHoldAcceptedOrderIdsForSelcted(this.allIds);
    }
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'ItemName', header: 'ITEM NAME' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'OrderQuantityList', header: 'ORDER WISE QUANTITY' },
    ]
  }

  public getReviewShipmentData(allIds: number[]): void {
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
    let filter: any = null;
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
        let filter = this.getSaveFilterRedirection();
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
        this.subjectService.setHoldWhereToRedirectOnBackFromShipped('BackToAccepted');
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

  confirmCreateShipmentOrder() {
    const ref = this.dialogService.open(ConfirmationModelComponent, {
      data: {
        action: 'create_Shipment_order',
        message: 'Are you sure? you want to create Shipment selected order.',
      },
      height: '30%',
      width: '30%'
    });

  }
}