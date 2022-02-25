import { Component, OnInit } from "@angular/core"
import { Location } from '@angular/common';
import { animate, state, style, transition, trigger } from "@angular/animations";


import { BaseComponent } from "../../base.component";
import { Observable, of, take } from "rxjs";
import { Router } from "@angular/router";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";
import { PrintModelComponent } from "src/app/modules/print-model/print-model.component";
import { DataService } from "src/app/shared/services/data.service";
import { DialogService } from "primeng/dynamicdialog";
import { cloneDeep, forEach, remove } from "lodash-es";

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
  public goCancel: number[] = [];
  public holdOrder: any;

  constructor(
    private _location: Location,
    private router: Router,
    private toasterService: ToasterService,
    private adminOrderService: AdminOrderService,
    private subjectService: SubjectService,
    private ds: DataService,
    private dialogService: DialogService
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
      { field: 'ItemName', header: 'ITEM NAME' },
      { field: 'NetQuantity', header: 'NET QUANTITY' },
      { field: 'Orders', header: 'ORDERS' },
      { field: 'DispatchQuantity', header: 'DISPATCH QUANTITY' },
    ]
  }

  public expandAll() {
    if (!this.isExpanded) {
      this.orders$.pipe(take(1)).subscribe(res => {
        if (res && res.length) {
          res.forEach(order => {
            this.expandedRows[order.ItemName] = true;
          })
        }
      })
    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  public getBulkAcceptedOrder() {
    this.adminOrderService
      .getBulkAcceptedOrderService()
      .subscribe((res) => {
        if (res && res.Status == 'OK') {
          this.holdOrder = res?.Data;
          console.log("bulkdata",res.Data)
          const item1 = res?.Data?.Item1;
          console.log('item1', item1)
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
    if (orderId && !this.goCancel?.includes(orderId)) {
      this.goCancel.push(orderId);
      console.log('this.go', this.goCancel);
    }
  }

  public cancelOrder(showHideModel: boolean): void {
    this.showCancelPopUp(showHideModel);
  }

  public next(): void {
    const orders = this.getBulkOrder();
    if (this.goCancel && !this.goCancel?.length) {
      if (orders && orders.length) {
        this.router.navigate(['/admin', 'order', 'bulk-accept', 'confirm']);
        this.subjectService.setHoldBulkDataForNext(orders);
      } else {
        this.toasterService.info('There is no order to proceed.')
      }
    } else {
      console.log('goCancel', this.goCancel)
      const newItem1 = cloneDeep(this.holdOrder.Item1)
      const newItem2 = remove(cloneDeep(this.holdOrder.Item2), (obj: any) => !this.goCancel?.includes(obj.OrderId));
      if (newItem1 && newItem1.length) {
        newItem1.forEach((item: any, index: any, object: any) => {
          // item.expandedRow = newItem2.filter((sameItem: any) => sameItem.ItemName === item.ItemName)
          const rowData = newItem2.filter((sameItem: any) => sameItem.ItemName === item.ItemName);
          if (rowData.length) {
            item.expandedRow = rowData;
          } else {
            if (rowData.length === 0) {
              object.splice(index, 1);
            }
          }
        });
      }
      console.log('after remove order', newItem1)
      this.subjectService.setHoldBulkDataForNext(newItem1);
      this.subjectService.setHoldBulkOrderIdsForCancel(this.goCancel);
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

  show() {
    const req = {
      url: '/api/sellerDashboard/ShopOverview/GetBulkAcceptOrderData',
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        const ref = this.dialogService.open(PrintModelComponent, {
          data: res.Data,
          width: '70%',
          height: '70%'
        });
      }

    });
  }

  onRemoveOk() {
    // const index = this.prod
  }
}

