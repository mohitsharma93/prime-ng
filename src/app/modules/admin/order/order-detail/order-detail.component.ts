import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Location} from '@angular/common';
import {data} from '../product-dummy';
import { AdminOrderService } from 'src/app/shared/admin-service/order/order.service';
import { Observable, of, take, takeUntil } from 'rxjs';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from '../../base.component';
import { FormControl, Validators } from '@angular/forms';
import { IOrderCancelModel, IOrderQuantityUpdateModel } from 'src/app/models/admin/order';

interface Product {
  id?:string;
  name?:string;
  address?:string;
  mobile?:string;
  order_amt?:string;
  order_date?:string;
  status?:string;
}

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent extends BaseComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;

  public routeParam: Params;
  public orders$: Observable<Product[]> = of([]);

  public columns: any[] = [];
  public cancelModelShow: boolean = false;
  public cancelReasonControl: FormControl = new FormControl('', [ Validators.required ]);
  public selectedOrderDetail: Observable<any>;
  public showPrint: boolean = false;
  public showAction: boolean = false;
  public statusWhereToShowActionColumn = [1, 3, 4];

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService
  ) {
    super();
    this.actRoute.params.subscribe(res => {
      this.routeParam = res;
      if (res && res['orderId']) {
        this.getOrderDetailRecord(res['orderId']);
      }
    })
  }

  public ngOnInit(): void {
    this.subjectService.orderDetail$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log('res', res);
      if (res && (res?.OrderID || res?.ShipmentID)) {
        this.selectedOrderDetail = of(res);
        this.setColumById(0);
        if (this.statusWhereToShowActionColumn.includes(res?.orderStatusId)) {
          this.showAction = true;
          if (res.orderStatusId === 3 || res.orderStatusId === 4 ) {
            this.showPrint = true;
          }
        }
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public redirectToDetail(id: string): void {
    if (id) {
      this.router.navigate(['/admin', 'order-detail', id]);
    }
  }

  public cancelOrder(showHideModel: boolean): void {
    this.cancelModelShow = showHideModel
  }

  public paginate(event: any): void {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
  }

  public setColumById(id: number) {
    if (id === 3) {
      this.columns = [
        { field: 'ShipmentID', header: 'SHIPMENT ID' },
        { field: 'ShipmentCount', header: 'ORDERS COUNT' },
        { field: 'OrderAmount', header: 'SHIPMENT AMOUNT' },
        { field: 'OrderDate', header: 'CREATED DATE' }
      ]
    } else if (id === 4) {
      this.columns = [
        { field: 'ShipmentID', header: 'SHIPMENT ID' },
        { field: 'ShipmentCount', header: 'ORDERS COUNT' },
        { field: 'OrderAmount', header: 'SHIPMENT AMOUNT' },
        { field: 'OrderDate', header: 'CREATED DATE' },
        { field: 'CloseDate', header: 'CLOSED DATE' }
      ]
    } else {
      this.columns = [
        { field: 'ProductName', header: 'ITEM NAME' },
        { field: 'CategoryName', header: 'CATEGORY' },
        { field: 'Quantity', header: 'QUANTITY' },
        { field: 'Moq', header: 'MOQ' },
        { field: 'Mrp', header: 'MRP' },
        { field: 'SellingPrice', header: 'SELLING PRICE' },
        { field: 'SellingPrice', header: 'NET AMOUNT' },
      ]
    }
  }

  public getStatusIdByString(key: string) {
    // switch (key) {
    //   case 3:
    //     return 'GetInTransitOrderDetails';
    //   case 4:
    //     return 'GetDeliveredOrderDetails';
    //   default:
    //     return 'GetAllOrderDetails';
    // }
  }

  public getOrderDetailRecord(orderId: number): void {
    this.adminOrderService.getOrderDetailRecordService(orderId).subscribe(res => {
      if (res && res.Status == 'OK') {
        const changeRes = res?.Data;
        if (this.getCurrentOrder()?.Status === 'Pending') {
          changeRes.map((order: any) => {
            order['showEdit'] = true;
          })
        }
        this.orders$ = of(changeRes);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }

  public getCurrentOrder() {
    let order = {} as any | null ;
    this.selectedOrderDetail.pipe(take(1)).subscribe(res => {
      order = res;
    })
    return order;
  }

  public hitCancelOrderApi(hideShowCancelModel: boolean): void {
    if (this.cancelReasonControl.valid) {
      const obj: IOrderCancelModel = {
        OrderID: this.getCurrentOrder()?.OrderID,
        DetailID: null,
        Remark: this.cancelReasonControl.value
      }
      this.adminOrderService.cancelOrderService(obj).subscribe(res => {
        if (res && res?.Status == 'OK') {
        } else {
          this.toasterService.error(res?.ErrorMessage);
        }
        this.cancelReasonControl.setValue('')
        this.cancelOrder(hideShowCancelModel);
      });
    } else {
      this.cancelReasonControl.markAllAsTouched();
    }
  }

  public changeAmountAsPerQuantity(quantity: number, order: any) {
    if (quantity) {
      // order.NetAmount = order.SellingPrice * quantity;
    }
  }

  public saveQuantity(order: any) {
    console.log('order', order);
    const obj: IOrderQuantityUpdateModel = {
      OrderID: order?.OrderId,
      DetailID: order?.DetailId,
      Quantity: order.Quantity
    }
    this.adminOrderService.updateQuantityService(obj).subscribe(res => {
      if (res && res?.Status == 'OK') {
        order['showEdit'] = true;
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }

  public acceptOrder() {
    this.adminOrderService.acceptOrderService(this.getCurrentOrder()?.OrderID).subscribe(res => {
      if (res && res?.Status == 'OK') {
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }

  public addToShipment() {
    this.adminOrderService.addToShipmentService(this.getCurrentOrder()?.OrderID).subscribe(res => {
      if (res && res?.Status == 'OK') {
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }
}
