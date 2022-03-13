import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminOrderService } from 'src/app/shared/admin-service/order/order.service';
import { forkJoin, Observable, of, Subscription, take, takeUntil } from 'rxjs';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { BaseComponent } from '../../base.component';
import { FormControl, Validators } from '@angular/forms';
import { IOrderCancelModel, IOrderQuantityUpdateModel } from 'src/app/models/admin/order';
import { PrintInvoiceModelComponent } from 'src/app/modules/print-invoice-model/print-invoice-model.component';
import { PrintShipmentModelComponent } from 'src/app/modules/print-shipment-model/print-shipment-model.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DataService } from 'src/app/shared/services/data.service';
import { PrintInvoiceMultipleModelComponent } from 'src/app/modules/print-invoice-multiple-model/print-invoice-multiple-model.component';
import { PrimeNGConfig } from 'primeng/api';
import { cloneDeep } from 'lodash-es';
import { ConfirmationService } from 'src/app/shared/services/confirmation.service';
import { ConfirmationModelComponent } from 'src/app/modules/confirmation-model/confirmation-model.component';

interface Products {
  id?: string;
  name?: string;
  address?: string;
  mobile?: string;
  order_amt?: string;
  order_date?: string;
  Status?: string;
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
export class OrderDetailComponent extends BaseComponent implements OnInit, OnDestroy {

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
  public selectedData: any[] = [];
  id: any;
  public singleCancelOnStatusShipped: boolean = false;
  public singleCancelOrderId: any = null;
  printInvoiceIds: any[] = [];
  public disableAcceptOrder: any = {};
  public notCallApiAfterQuantityUpdate: boolean = true;
  public showHideCheckbox: boolean = true;
  public subscription: Subscription;
  
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private ds: DataService,
    public dialogService: DialogService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService
  ) {
    super();
    this.actRoute.params.subscribe(res => {
      this.routeParam = res;
      if (res && res['orderId']) {
        this.id = res['orderId']
      }
    });
    this.subscription = this.confirmationService.getConfirmation().subscribe((response: any) => {
      if (response.status) {
        if (response.action === 'accepted_order') {
          this.acceptOrder();
        }
        if (response.action === 'delivered_order') {
          this.deliveredSelected();
        }
        if (response.action === 'addToShipment_order') {
          this.addToShipment();
        }
      }
    });
  }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.subjectService.orderDetail$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log('orderDetail$', res)
      if (res && (res?.OrderID || res?.ShipmentId)) {
        if ((this.routeParam && this.routeParam['orderId']) && this.notCallApiAfterQuantityUpdate) {
          const apiMiddleStr = this.getApiCallStatusWise(res?.orderStatusId);
          this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
        }
        this.selectedOrderDetail = of(res);
        this.setColumById(res?.orderStatusId);
        if (this.status.includes(res?.Status)) {
          this.showAction = true;
          if (res.Status === 'Shipped' || res.Status === 'Delivered') {
            this.showPrint = true;
          }
        } else {
          this.showAction = false;
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public backClicked(): void {
    this.subjectService.holdWhereToRedirectOnBackFromShipped$.pipe(take(1)).subscribe(res => {
      if (res && res === 'BackToAccepted') {
        let filter = this.getSaveFilterRedirection();
        if (filter && Object.keys(filter).length) {
          filter.topFilter.Status = 2
          this.subjectService.setSaveFilterOnRedirection(filter);
        }
        this.subjectService.setHoldWhereToRedirectOnBackFromShipped(null);
        this.backClicked();
        return;
      }
    });
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
    this.printInvoiceIds = [];
    this.adminOrderService.getOrderDetailRecordService(orderId, apiMiddleStr).subscribe(res => {
      if (res && res.Status == 'OK') {
        let changeRes = res?.Data;
        if (changeRes && changeRes.shipMentOrderDataListDTO) {
          for (const item of changeRes.shipMentOrderDataListDTO) {
            this.printInvoiceIds.push(item.OrderId);
          }
        } else if (changeRes && changeRes.deliveredOrderDataListDTO) {
          for (const item of changeRes.deliveredOrderDataListDTO) {
            this.printInvoiceIds.push(item.OrderId);
          }
        }
        console.log('changeRes before change', changeRes)
        if (this.getCurrentOrder()?.Status === 'Pending') {
          changeRes.getShowOrderDetailList.map((order: any) => {
            order['showEdit'] = true;
          });
        }
        if (apiMiddleStr === 'GetShipmentOrderData' || apiMiddleStr === 'GetShipmentdeliveredOrderData') {
          if (apiMiddleStr === 'GetShipmentOrderData') {

            changeRes = changeRes.shipMentOrderDataListDTO
            if (res?.Data?.shipMentOrderDataListDTO && res?.Data?.shipMentOrderDataListDTO?.length === 0) {
              this.backClicked();
            }
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
        OrderID: (this.singleCancelOnStatusShipped) ? this.singleCancelOrderId  : this.getCurrentOrder()?.OrderID,
        DetailID: null,
        Remark: this.cancelReasonControl.value
      }
      this.adminOrderService.cancelOrderService(obj).subscribe(res => {
        console.log("cancelres",res);
        if (res && res?.Status == 'OK') {
          if (this.singleCancelOnStatusShipped) {
            this.singleCancelOnStatusShipped = false;
            this.singleCancelOrderId = null;
            this.cancelReasonControl.setValue('')
            this.cancelOrder(hideShowCancelModel);
            // const order = this.getCurrentOrder()
            // const apiMiddleStr = this.getApiCallStatusWise(order.orderStatusId);
            // this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)

            this.changeOrderStatus([+obj?.OrderID], 'Cancelled')
            const checkShippedExistInOrder = this.checkShippedExistInOrder();
            if (checkShippedExistInOrder) {
              this.showHideCheckbox = false;
            }
            return
          }
          this.backClicked();
        } else {
          this.toasterService.error(res?.ErrorMessage);
          if (this.singleCancelOnStatusShipped) {
            this.singleCancelOnStatusShipped = false;
            this.singleCancelOrderId = null;
          }
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
        delete this.disableAcceptOrder[order?.DetailId];
        order['showEdit'] = true;
        const orders = this.getLocalOrder();
        const sum = orders?.reduce((acc: number, order: any) => acc += order.TotalPrice, 0)
        console.log('sum', sum);
        if (sum && sum > 0) {
          this.notCallApiAfterQuantityUpdate = false
          const orderDetail = this.getOrderDetailUpSide();
          orderDetail['OrderAmount'] = sum;
          this.subjectService.setOrderDetail(orderDetail);
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
    const getAllReadyAvailId = this.subjectService.holdAcceptedOrderForSelected.value || [];
    this.subjectService.setHoldAcceptedOrderForSelected([...getAllReadyAvailId, this.getCurrentOrder()?.OrderID]);
    let filter = this.getSaveFilterRedirection();
    if (filter && Object.keys(filter).length) {
      filter.topFilter.Status = 2
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.backClicked();
    }
  }

  public showAddToShipMentOrNot(whichOne : string) {
    const getAllReadyAvailId = this.subjectService.holdAcceptedOrderForSelected.value || [];
    const currentId = this.getCurrentOrder()?.OrderID;
    if (getAllReadyAvailId.includes(currentId)) {
      if (whichOne === 'Add') {
        return false;
      }
      if (whichOne === 'Remove') {
        return true;
      }
    }
    if (whichOne === 'Remove') {
      return false;
    }
    return true;
  }

  public removeFromShipment() {
    let getAllReadyAvailId = cloneDeep(this.subjectService.holdAcceptedOrderForSelected.value || []);
    const id = this.getCurrentOrder()?.OrderID
    if (getAllReadyAvailId.includes(id)) {
      getAllReadyAvailId = getAllReadyAvailId.filter((x : number) => x !== id)
    }
    this.subjectService.setHoldAcceptedOrderForSelected(getAllReadyAvailId);
    let filter = this.getSaveFilterRedirection();
    if (filter && Object.keys(filter).length) {
      filter.topFilter.Status = 2
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.backClicked();
    }
  }

  public deliveredSelected() {
    if (this.selectedData && this.selectedData.length) {
      const allOrderId = this.selectedData.map(o => o.OrderId);
      const shipmentId = this.getOrderDetailUpSide()?.ShipmentId;
      this.adminOrderService.deliveredSelectedService(allOrderId, shipmentId).subscribe(res => {
        if (res && res?.Status == 'OK') {
          const localOrder = this.getLocalOrder();
          if (localOrder && localOrder.length === this.selectedData.length) {
            // this.redirectToOrder();
          }
          // const orderDetail = this.getCurrentOrder();
          // const apiMiddleStr = this.getApiCallStatusWise(orderDetail?.orderStatusId);
          // this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
          this.changeOrderStatus(allOrderId, 'Delivered')
          const checkShippedExistInOrder = this.checkShippedExistInOrder();
          if (checkShippedExistInOrder) {
            this.showHideCheckbox = false;
          }
          this.selectedData = [];
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
          const localOrder = this.getLocalOrder();
          if (localOrder && localOrder.length === this.selectedData.length) {
            // this.redirectToOrder();
          }
          this.cancelOrder(false);
          // const orderDetail = this.getCurrentOrder();
          // const apiMiddleStr = this.getApiCallStatusWise(orderDetail?.orderStatusId);
          // this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
          this.changeOrderStatus(allOrderId, 'Cancelled')
          const checkShippedExistInOrder = this.checkShippedExistInOrder();
          if (checkShippedExistInOrder) {
            this.showHideCheckbox = false;
          }
          this.selectedData = [];
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

  printCancelInvoice() {
    const order = this.getCurrentOrder();
    if (order) {
      order['OrderId'] = order['OrderID'];
      this.printInvoice(order)
    }
  }

  public printInvoiceMultiple() {
    let itemCount = 0;
    let printData: any[] = [];
    let calls: any[] = [];
    for (let i = 0; i < this.printInvoiceIds.length; i++) {
      const req = {
        url: `/api/sellerDashboard/ShopOverview/GetPrintInvoice/${this.printInvoiceIds[i]}`,
        params: ''
      };
      calls.push(this.ds.get(req));
    }
    // some one who use forkJoin with reset parameter please remove it use array direct (pass reset in it is deprecated in v8)
    forkJoin(...calls).subscribe((data: any) => {
      if (data && data.length) {
        for (const apiRes of data) {
          if (apiRes.Status === 'OK') {
            printData.push(apiRes.Data);
          }
        }
      }
      if (printData.length > 0) {
        const ref = this.dialogService.open(PrintInvoiceMultipleModelComponent, {
          data: printData,
          width: '70%',
          height: '70%'
        });
      }
    })
  }

  public printInvoice(order: any) {
    console.log(order);
    const req = {
      url: `/api/sellerDashboard/ShopOverview/GetPrintInvoice/${order.OrderId}`,
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      console.log(res.Data);
      if (res.Status === 'OK') {
        const ref = this.dialogService.open(PrintInvoiceModelComponent, {
          data: res.Data,
          width: '70%',
          height: '70%'
        });
      }
    });
  }

  public shipmentModel() {
    const order = this.getCurrentOrder();
    const req = {
      url: `api/sellerDashboard/ShopOverview/GetPrintShipmentDetails/${order.orderStatusId}/${this.id}`,
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        const ref = this.dialogService.open(PrintShipmentModelComponent, {
          data: res.Data,
          width: '70%',
          height: '70%'
        });
      }
    });
  }

  public redirectToOrder() {
    let filter = this.getSaveFilterRedirection();
    console.log('filter', filter)
    if (filter && Object.keys(filter).length) {
      filter.topFilter.Status = 2
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.router.navigate(['/admin', 'order'])
    } else {
      const filter = {
        topFilter: {
          Status: 2,
          searchTimeRange: 'OverAll',
          PageNo: 1,
          PageSize: 25
        }
      }
      this.subjectService.setSaveFilterOnRedirection(filter);
      this.router.navigate(['/admin', 'order'])
    }
  }

  public deliverOrder(id: string): void {
    this.adminOrderService.deliveredOrder(id, {}).subscribe(res => {
      console.log(res)
      if (res && res?.Status == 'OK') {
        // this.backClicked();
        // const order = this.getCurrentOrder()
        // const apiMiddleStr = this.getApiCallStatusWise(order.orderStatusId);
        // this.getOrderDetailRecord(this.routeParam['orderId'], apiMiddleStr)
        this.changeOrderStatus([+id], 'Delivered')
        const checkShippedExistInOrder = this.checkShippedExistInOrder();
        if (checkShippedExistInOrder) {
          this.showHideCheckbox = false;
        }
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
      this.cancelReasonControl.setValue('')
    });
  }

  public rowSingleCancel(cancel: boolean, orderId: any) {
    this.singleCancelOrderId = orderId;
    this.singleCancelOnStatusShipped = cancel;
    this.cancelOrder(cancel)
  }

  public checkSomeOneEditEnable(): boolean {
    return this.disableAcceptOrder && Object.keys(this.disableAcceptOrder).length
  }

  public returnItemForMenu(orderId: any) {
    return [
      {
        label: 'Delivered',
        command: () => {
            this.deliverOrder(orderId);
        }
      },
      {
        label: 'Cancel',
        command: () => {
            this.rowSingleCancel(true, orderId);
        }
      }
    ]
  }

  public checkShippedExistInOrder(): boolean {
    const allOrders = this.getLocalOrder();
    const checkStatus = allOrders?.filter((order: any) => order.Status === 'Shipped');
    if (checkStatus && checkStatus.length) {
      return false;
    } else {
      if (checkStatus && checkStatus.length === 0) {
        return true;
      }
    }
    return true;
  }

  public changeOrderStatus(orderId: number[], status: 'Delivered' | 'Cancelled') {
    const allOrders = this.getLocalOrder() as Products[];
    if (allOrders && allOrders.length) {
      console.log('orderId', orderId)
      orderId.forEach((id: number) => {
        const index = allOrders?.findIndex((order: any) => order.OrderId === id);
        if (index > -1) {
          allOrders[index].Status = status;
        }
      })
    }
    console.log('allOrders', allOrders);
    this.orders$ = of(allOrders)
  }

  public confirmAddToShipmentOrder() {
    const ref = this.dialogService.open(ConfirmationModelComponent, {
      data: {
        action: 'addToShipment_order',
        message: 'Are you sure? you want to add to shipment selected order.',
      },
      height: '30%',
      width: '30%'
    });

  }

  public confirmAcceptedOrder() {
    const ref = this.dialogService.open(ConfirmationModelComponent, {
      data: {
        action: 'accepted_order',
        message: 'Are you sure? you want to accepted selected order.',
      },
      height: '30%',
      width: '30%'
    });

  }
  public confirmDeliveredOrder() {
    const ref = this.dialogService.open(ConfirmationModelComponent, {
      data: {
        action: 'delivered_order',
        message: 'Are you sure? you want to delivered selected order.',
      },
      height: '30%',
      width: '30%'
    });

  }
}
