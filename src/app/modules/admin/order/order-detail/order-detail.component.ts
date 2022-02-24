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
import { MenuItem } from 'primeng/api';
import { PrintInvoiceModelComponent } from 'src/app/modules/print-invoice-model/print-invoice-model.component';
import { PrintShipmentModelComponent } from 'src/app/modules/print-shipment-model/print-shipment-model.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/shared/services/data.service';

interface Products {
  id?: string;
  name?: string;
  address?: string;
  mobile?: string;
  order_amt?: string;
  order_date?: string;
  status?: string;
}

interface Product {
  shipmentId: number;
  getShowOrderDetailList: Products[]
}

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent extends BaseComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;

  public routeParam: Params;
  public orders$: Observable<Products[]> = of([]);

  public columns: any[] = [];
  public cancelModelShow: boolean = false;
  public cancelReasonControl: FormControl = new FormControl('', [Validators.required]);
  public selectedOrderDetail: Observable<any>;
  public showPrint: boolean = false;
  public showAction: boolean = false;
  public statusWhereToShowActionColumn = [1, 3, 4];
  public status = ['Pending', 'Shipped', 'Delivered'];
  public menuItems: MenuItem[] = [
    { label: 'Accept', command: () => { this.hitApiOnMenuItemClick(); } },
    { label: 'Cancel', command: () => { this.hitApiOnMenuItemClick(); } }
  ];
  public selectedData: any[] = [];
  id: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private ds: DataService,
    public dialogService: DialogService

  ) {
    super();
    this.actRoute.params.subscribe(res => {
      this.routeParam = res;
      if (res && res['orderId']) {
        this.id = res['orderId']
      }
    })
    // this.setMenuItem();
  }

  public ngOnInit(): void {
    this.subjectService.orderDetail$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log('orderDetail$', res)
      // if (res && (res?.OrderID || res?.ShipmentId)) {
      //   if (this.routeParam && this.routeParam['orderId']) {
      //     const apiMiddleStr = this.getApiCallStatusWise(res?.orderStatusId);
      //     this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
      //   }
      //   this.selectedOrderDetail = of(res);
      //   this.setColumById(res?.orderStatusId);
      //   if (this.statusWhereToShowActionColumn.includes(res?.orderStatusId)) {
      //     this.showAction = true;
      //     if (res.orderStatusId === 3 || res.orderStatusId === 4 ) {
      //       this.showPrint = true;
      //       // if (res.orderStatusId === 3) {
      //       //   this.setMenuItem();
      //       // }
      //     }
      //   } else {
      //     this.showAction = false;
      //   }
      // }
      if (res && (res?.OrderID || res?.ShipmentId)) {
        if (this.routeParam && this.routeParam['orderId']) {
          const apiMiddleStr = this.getApiCallStatusWise(res?.orderStatusId);
          this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
        }
        this.selectedOrderDetail = of(res);
        this.setColumById(res?.orderStatusId);
        if (this.status.includes(res?.Status)) {
          this.showAction = true;
          if (res.Status === 'Shipped' || res.Status === 'Delivered') {
            this.showPrint = true;
            // if (res.orderStatusId === 3) {
            //   this.setMenuItem();
            // }
          }
        } else {
          this.showAction = false;
        }
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public redirectToDetail(order: any): void {
    if (order) {
      this.subjectService.setOrderDetailShipment(order);
      this.router.navigate(['/admin', 'order', 'detail', this.getCurrentOrder()?.ShipmentId | 4, 's', order.OrderId]);
    }
  }

  public cancelOrder(showHideModel: boolean): void {
    this.cancelModelShow = showHideModel
  }

  public setColumById(id: number) {
    if (id === 3) {
      this.columns = [
        { field: 'OrderId', header: 'ORDER ID' },
        { field: 'ShopName', header: 'NAME' },
        { field: 'newAddress', header: 'ADDRESS' },
        { field: 'Mobile', header: 'MOBILE' },
        { field: 'OrderAmount', header: 'ORDERS AMOUNT' },
        { field: 'OrderDate', header: 'ORDERS DATE' },
        { field: 'Status', header: 'STATUS' },
      ]
    } else if (id === 4) {
      this.columns = [
        { field: 'OrderId', header: 'ORDER ID' },
        { field: 'ShopName', header: 'NAME' },
        { field: 'newAddress', header: 'ADDRESS' },
        { field: 'Mobile', header: 'MOBILE' },
        { field: 'OrderAmount', header: 'ORDERS AMOUNT' },
        { field: 'OrderDate', header: 'ORDERS DATE' },
        { field: 'DeliveryDate', header: 'DELIVERY DATE' },
        { field: 'Status', header: 'STATUS' },
      ]
    } else {
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
  }

  public setMenuItem() {
    this.menuItems = [
      { label: 'Accept', command: () => { this.hitApiOnMenuItemClick(); } },
      { label: 'Cancel', command: () => { this.hitApiOnMenuItemClick(); } }
    ]
  }

  public hitApiOnMenuItemClick() {

  }

  public getApiCallStatusWise(key: number): string {
    switch (key) {
      case 3:
        return 'GetShipmentOrderData';
      case 4:
        return 'GetShipmentdeliveredOrderData'
      default:
        return 'GetOrderDetailRecord';
    }
  }

  public getOrderDetailRecord(orderId: number, apiMiddleStr: string): void {
    this.adminOrderService.getOrderDetailRecordService(orderId, apiMiddleStr).subscribe(res => {
      if (res && res.Status == 'OK') {
        let changeRes = res?.Data;
        console.log('changeRes before change', changeRes)
        if (this.getCurrentOrder()?.Status === 'Pending') {
          changeRes.getShowOrderDetailList.map((order: any) => {
            order['showEdit'] = true;
          });
        }
        if (apiMiddleStr === 'GetShipmentOrderData' || apiMiddleStr === 'GetShipmentdeliveredOrderData') {
          if (apiMiddleStr === 'GetShipmentOrderData') {

            changeRes = changeRes.shipMentOrderDataListDTO
          }
          if (apiMiddleStr === 'GetShipmentdeliveredOrderData') {
            changeRes = changeRes.deliveredOrderDataListDTO
            // changeRes = changeRes.shipMentOrderDataListDTO
          }
          changeRes.map((p: any) => {
            let newAddress = ''
            if (p.Address1) newAddress += ' ' + p.Address1;
            if (p.Address2) newAddress += ' ' + p.Address2;
            if (p.Address3) newAddress += ' ' + p.Address3;
            if (newAddress?.length) p['newAddress'] = newAddress
          })
        } else {
          changeRes = changeRes.getShowOrderDetailList
        }
        console.log('changeRes after change', changeRes)
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
      const obj: IOrderCancelModel = {
        OrderID: this.getCurrentOrder()?.OrderID,
        DetailID: null,
        Remark: this.cancelReasonControl.value
      }
      this.adminOrderService.cancelOrderService(obj).subscribe(res => {
        if (res && res?.Status == 'OK') {
          this.backClicked();
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
      order.TotalPrice = order.SellingPrice * quantity;
    }
  }

  public saveQuantity(order: any) {
    const obj: IOrderQuantityUpdateModel = {
      OrderID: order?.OrderId,
      DetailID: order?.DetailId,
      Quantity: order.Quantity
    }
    this.adminOrderService.updateQuantityService(obj).subscribe(res => {
      console.log(res);
      if (res && res?.Status == 'OK') {
        order['showEdit'] = true;
        const orders = this.getLocalOrder();
        const sum = orders?.reduce((acc: number, order: any) => acc += order.TotalPrice, 0)
        console.log('sum', sum);
        if (sum && sum > 0) {
          const orderDetail = this.getOrderDetailUpSide();
          orderDetail['OrderAmount'] = sum;
          this.subjectService.setOrderDetail(orderDetail)
        }
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }

  public acceptOrder() {
    const currentOrder = this.getCurrentOrder();
    this.adminOrderService.acceptOrderService(currentOrder?.OrderID).subscribe(res => {
      if (res && res?.Status == 'OK') {
        if (currentOrder && currentOrder.Status) {
          currentOrder['Status'] = 'Accepted';
          currentOrder['orderStatusId'] = 2;
          this.subjectService.setOrderDetail(currentOrder);
        }
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }

  public getSaveFilterRedirection() {
    let filter: any = null;
    this.subjectService.saveFilterOnRedirection$.pipe(take(1)).subscribe(res => {
      filter = res;
    });
    return filter;
  }

  public addToShipment() {
    // this.adminOrderService.addToShipmentService(this.getCurrentOrder()?.OrderID).subscribe(res => {
    //   if (res && res?.Status == 'OK') {
    //     this.backClicked();
    //   } else {
    //     this.toasterService.error(res?.ErrorMessage);
    //   }
    // });
    this.subjectService.setHoldAcceptedOrderForSelected(this.getCurrentOrder()?.OrderID);
    let filter = this.getSaveFilterRedirection();
    if (filter && Object.keys(filter).length) {
      filter.topFilter.orderStatusId = 2
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.backClicked();
    }
  }

  public deliveredSelected() {
    if (this.selectedData && this.selectedData.length) {
      const allOrderId = this.selectedData.map(o => o.OrderId);
      this.adminOrderService.deliveredSelectedService(allOrderId).subscribe(res => {
        if (res && res?.Status == 'OK') {
          this.redirectToOrder();
        } else {
          this.toasterService.error(res?.ErrorMessage);
        }
      });
    } else {
      this.toasterService.info('Please select order through checkbox for delivered')
    }
  }

  public warningCancel() {
    this.toasterService.info('Please select order through checkbox for cancelled')
  }

  public cancelSelected() {
    if (this.selectedData && this.selectedData.length) {
      const allOrderId = this.selectedData.map(o => o.OrderId);
      this.adminOrderService.canceledSelectedService(this.cancelReasonControl.value, allOrderId).subscribe(res => {
        if (res && res?.Status == 'OK') {
          this.redirectToOrder();
        } else {
          this.toasterService.error(res?.ErrorMessage);
        }
      });
    } else {
      this.toasterService.info('Please select order through checkbox for cancelled')
    }
  }

  public getLocalOrder(): any[] | null {
    let order: any[] | null = null;
    this.orders$.pipe(take(1)).subscribe(res => {
      order = res
    });
    return order;
  }

  public getOrderDetailUpSide(): any {
    let upSideOrderDetail: any;
    this.selectedOrderDetail.pipe(take(1)).subscribe(res => {
      upSideOrderDetail = res;
    });
    return upSideOrderDetail
  }


   public show() {
    {
      const req = {
        url: '/api/sellerDashboard/ShopOverview/GetBulkAcceptOrderData',
        params: '',
      };
      this.ds.get(req).subscribe((res: any) => {
        if (res.Status === 'OK') {
          const ref = this.dialogService.open(PrintInvoiceModelComponent, {
            width: '70%',
            height: '70%'
          });
          return (res);
        }
      });
    }
  }

  public shipmentModel() {
    {
      const req = {
        url: `/api/sellerDashboard/ShopOverview/GetPrintShipmentDetails/${this.id}`,
        params: '',
      };
      this.ds.get(req).subscribe((res: any) => {
        if (res.Status === 'OK') {
          const ref = this.dialogService.open(PrintShipmentModelComponent, {
            data: res.Data,
            width: '70%',
            height: '70%'
          });
          return (res);
        }
      });
    }
  }

  public redirectToOrder() {
    let filter = this.getSaveFilterRedirection();
    if (filter && Object.keys(filter).length) {
      filter.topFilter.orderStatusId = 2
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.router.navigate(['/admin', 'order'])
    }
  }
}
