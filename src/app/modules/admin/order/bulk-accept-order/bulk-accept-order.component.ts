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
import { clone, cloneDeep, forEach, remove } from "lodash-es";

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
  public holdOrderIdToAddCancel: number | null = null;

  constructor(
    private _location: Location,
    private router: Router,
    private toasterService: ToasterService,
    private adminOrderService: AdminOrderService,
    private subjectService: SubjectService,
    private ds: DataService,
    private dialogService: DialogService,
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
          this.holdOrder = cloneDeep(res?.Data);
          console.log("this.holdOrder",this.holdOrder)
          const item1 = res?.Data?.Item1;
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

  public showCancelPopUp(
    showHideModel: boolean,
    orderId: number | null = null,
  ) {
    this.cancelModelShow = showHideModel;
    if (orderId) {
      this.holdOrderIdToAddCancel = orderId;
    }
  }
  
  public cancelOrder(showHideModel: boolean, whereFrom: string = 'no'): void {
    if (whereFrom === 'yes') {
      if (this.holdOrderIdToAddCancel && !this.goCancel?.includes(this.holdOrderIdToAddCancel)) {
        this.goCancel.push(this.holdOrderIdToAddCancel);
        console.log('this.go', this.goCancel);
      }
      if (this.goCancel && this.goCancel.length) {
        // const getLastId = this.goCancel[this.goCancel.length - 1];
        const allOrders = this.getBulkOrder();
        const newOrders = cloneDeep(allOrders).reduce((acc: any, obj: any) => {
          const findRow = obj.expandedRow.findIndex((obj: any) => obj.OrderId === this.holdOrderIdToAddCancel)
          if (findRow > -1) {
            obj.expandedRow[findRow]['show'] = true;
          }
          return [...acc, obj];
        }, []);
        this.orders$ = of(newOrders);
      }
    }
    this.holdOrderIdToAddCancel = null;
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
      let newOne: any[] = []
      if (newItem1 && newItem1.length) {
        newOne = newItem1.reduce((pre: any, curr: any) => {
          curr.expandedRow = newItem2.filter((sameItem: any) => sameItem.ItemName === curr.ItemName);
          if (curr.expandedRow.length === 0) {
            return pre;
          }
          pre.push(curr);
          return pre;
        }, [])
      }
      console.log('after remove order', newOne)
      this.subjectService.setHoldBulkDataForNext(newOne);
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

  public itemQuantityChange(product: any) {
    console.log('product', product);
    product.DispatchQuantity = product.expandedRow.reduce((sum: number, row: any) => sum + row.Quantity, 0);
  }
}

