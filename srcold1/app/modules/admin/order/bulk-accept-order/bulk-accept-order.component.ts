import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';
import { animate, state, style, transition, trigger } from "@angular/animations";


import { BaseComponent } from "../../base.component";
import { Observable, of, take } from "rxjs";
import { Router } from "@angular/router";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";

@Component({
  selector: 'app-admin-bulk-accept-order',
  templateUrl: './bulk-accept-order.component.html',
  styleUrls: ['./bulk-accept-order.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class BulkAcceptOrderComponent extends BaseComponent implements OnInit {

  public cancelModelShow: boolean = false;
  public columns: any[] = [];
  public orders$: Observable<any[]>;
  public expandedRows: any = {};
  public isExpanded: boolean = false;
  public goCancel: number | null;

  constructor(
    private _location: Location,
    private router: Router,
    private toasterService: ToasterService,
    private adminOrderService: AdminOrderService,
    private subjectService: SubjectService,
  ) {
    super();
    this.setColumById();
  }

  ngOnInit() {
    this.getBulkAcceptedOrder()
  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'ItemName', header: 'ITEM NAME'},
      { field: 'NetQuantity', header: 'NET QUANTITY'},
      { field: 'Orders', header: 'ORDERS'},
      { field: 'DispatchQuantity', header: 'DISPATCH QUANTITY' },
    ]
  }

  public expandAll() {
    if(!this.isExpanded){
      this.orders$.pipe(take(1)).subscribe(res => {
        if (res && res.length) {
          res.forEach(order => {
            this.expandedRows[order.ItemName] = true;
          })
        }
      })
    } else {
      this.expandedRows={};
    }
    this.isExpanded = !this.isExpanded;
  }

  public getBulkAcceptedOrder() {
    this.adminOrderService
      .getBulkAcceptedOrderService()
      .subscribe((res) => {
        if (res && res.Status == 'OK') {
          const item1 = res?.Data?.Item1
          if (item1 && item1.length) {
            item1.forEach((item: any) => {
              item.expandedRow = res?.Data?.Item2.filter((sameItem: any) => sameItem.ItemName === item.ItemName)
            });
          }
          this.orders$ = of(item1)
        } else {
          this.toasterService.error(res?.ErrorMessage);
          this.setLoader(false);
        }
      });
  }

  public showCancelPopUp(showHideModel: boolean, orderId: number | null = null) {
    this.cancelModelShow = showHideModel;
    if (orderId) {
      this.goCancel = orderId;
    }
  }

  public cancelOrder(showHideModel: boolean): void {
    this.showCancelPopUp(showHideModel);
  }

  public next(): void {
    if (!this.goCancel) {
      const orders = this.getBulkOrder();
      if (orders && orders.length) {
        this.router.navigate(['/admin', 'order', 'bulk-accept', 'confirm']);
        this.subjectService.setHoldBulkDataForNext(orders);
      } else {
        this.toasterService.info('There is no order to proceed.')
      }
    } else {
      this.router.navigate(['/admin', 'order', 'bulk-accept', 'cancel']);
    }
  }
  
  public getBulkOrder() {
    let orders: any = null;
    this.orders$.pipe(take(1)).subscribe(res => {
      orders = res;
    });
    return orders;
  }
}