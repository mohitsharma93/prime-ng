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
import {MenuItem} from 'primeng/api';

interface Product {
  id?:string;
  name?:string;
  address?:string;
  mobile?:string;
  order_amt?:string;
  order_date?:string;
  status?:string;
}

interface Order {
  shipmentId: number;
  getShowOrderDetailList: Product[]
}

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './order-detail-shipment.component.html',
  styleUrls: ['./order-detail-shipment.component.scss']
})
export class OrderDetailShipmentComponent extends BaseComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;

  public routeParam: Params;
  public orders$: Observable<Order> = of();

  public columns: any[] = [];
  public cancelModelShow: boolean = false;
  public cancelReasonControl: FormControl = new FormControl('', [ Validators.required ]);
  public selectedOrderDetail: Observable<any>;
  public showPrint: boolean = false;
  public showAction: boolean = false;

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
      if (res && res['id']) {
        this.getOrderDetailRecord(res['id']);
      }
    })
    // this.setMenuItem();
  }

  public ngOnInit(): void {
    this.subjectService.orderDetailShipment$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log('detail', res);
      if (res && (res?.OrderId)) {
        this.selectedOrderDetail = of(res);
        this.setColumById();
      }
    });
  }

  public backClicked(): void {
    this._location.back();
  }

  public cancelOrder(showHideModel: boolean): void {
    this.cancelModelShow = showHideModel
  }

  public setColumById() {
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

  public getOrderDetailRecord(orderId: number): void {
    this.adminOrderService.getOrderDetailRecordService(orderId, 'GetOrderDetailRecord').subscribe(res => {
      if (res && res.Status == 'OK') {
        let changeRes = res?.Data
        console.log('changeRes after change', changeRes)
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
}
