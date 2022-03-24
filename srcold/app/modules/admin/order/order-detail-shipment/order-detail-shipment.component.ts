import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminOrderService } from 'src/app/shared/admin-service/order/order.service';
import { Observable, of, take, takeUntil } from 'rxjs';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from '../../base.component';
import { FormControl, Validators } from '@angular/forms';
import { IOrderCancelModel, IOrderQuantityUpdateModel } from 'src/app/models/admin/order';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/shared/services/data.service';
import { PrintInvoiceModelComponent } from 'src/app/modules/print-invoice-model/print-invoice-model.component';
import { ConfirmationModelComponent } from 'src/app/modules/confirmation-model/confirmation-model.component';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';

interface Product {
  id?: string;
  name?: string;
  address?: string;
  mobile?: string;
  order_amt?: string;
  order_date?: string;
  status?: string;
}

interface Order {
  ShipmentId: number;
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
  public cancelReasonControl: FormControl = new FormControl('', [Validators.required]);
  public selectedOrderDetail: Observable<any>;
  public showPrint: boolean = false;
  public showAction: boolean = false;
  public printOrderId: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private ds: DataService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
  ) {
    super();
    this.actRoute.params.subscribe(res => {
      this.routeParam = res;
      if (res && res['id']) {
        this.printOrderId = res['id']
        this.getOrderDetailRecord(res['id']);
      }
    })
    // this.setMenuItem();
    this.confirmationService.getConfirmation().pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      if (response.status) {
        if (response.action === 'delivered_order_single_order_detail') {
          this.deliveredOrder();
        }
      }
    });
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
      { field: 'TotalPrice', header: 'NET AMOUNT' },

    ]
  }

  public getOrderDetailRecord(orderId: number): void {
    this.adminOrderService.getOrderDetailRecordService(orderId, 'GetOrderDetailRecord').subscribe(res => {
      if (res && res.Status == 'OK') {
        let changeRes = res?.Data
        this.orders$ = of(changeRes);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }

  public getCurrentOrder() {
    let order = {} as any | null;
    this.selectedOrderDetail.pipe(take(1)).subscribe(res => {
      order = res;
    })
    return order;
  }

  public hitCancelOrderApi(hideShowCancelModel: boolean): void {
    if (this.cancelReasonControl.valid) {
      // const obj: IOrderCancelModel = {
      //   OrderID: this.getCurrentOrder()?.OrderId,
      //   DetailID: null,
      //   Remark: this.cancelReasonControl.value
      // }
      this.adminOrderService.canceledSelectedService(this.cancelReasonControl.value, [this.getCurrentOrder()?.OrderId]).subscribe(res => {
        if (res && res?.Status == 'OK') {
          const deliveredOrder = this.getCurrentOrder();
          deliveredOrder.Status = 'Cancelled'
          this.subjectService.setOrderDetailShipment(deliveredOrder);
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
  public deliveredOrder() {
    const id = this.getCurrentOrder()?.OrderId;
    console.log('routeParam', this.routeParam);
    this.adminOrderService.deliveredSelectedService([id], this.routeParam['orderId']).subscribe(res => {
      console.log(res)
      if (res && res?.Status == 'OK') {
        // this.backClicked();
        const deliveredOrder = this.getCurrentOrder();
        deliveredOrder.Status = 'Delivered'
        let getOrderDetailUpSide = this.getOrderDetailUpSide();
        if ((getOrderDetailUpSide && getOrderDetailUpSide?.ShipmentId) && (res?.Data?.Item2 && res?.Data?.Item2 !== '1900-01-01T00:00:00')) {
          getOrderDetailUpSide['CloseDate'] = res?.Data.Item2;
          getOrderDetailUpSide['Status'] = 'Delivered'
          this.subjectService.setOrderDetail(getOrderDetailUpSide);
        }
        this.subjectService.setOrderDetailShipment(deliveredOrder);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
      this.cancelReasonControl.setValue('')
    });
  }

  public printInvoice() {
    const req = {
      url: `/api/sellerDashboard/ShopOverview/GetPrintInvoice/${this.printOrderId}`,
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        const ref = this.dialogService.open(PrintInvoiceModelComponent, {
          data: res.Data,
          width: '70%',
          height: '70%'
        });
      }
    });
  }

  public confirmDeliveredSingleOrder() {
    const ref = this.dialogService.open(ConfirmationModelComponent, {
      data: {
        action: 'delivered_order_single_order_detail',
        message: 'Are you sure? you want to deliver order.',
      },
      height: '34%',
      width: '30%'
    });
  }

  public getOrderDetailUpSide(): any {
    let upSideOrderDetail: any;
    this.subjectService.orderDetail$.pipe(take(1)).subscribe(res => {
      upSideOrderDetail = res;
    });
    return upSideOrderDetail
  }
}
