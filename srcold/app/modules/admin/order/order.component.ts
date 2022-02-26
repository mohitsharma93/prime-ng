import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { IOrderRequestModel } from 'src/app/models/admin/order';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { BaseComponent } from '../base.component';
import { cloneDeep } from 'lodash-es';
import { AdminOrderService } from 'src/app/shared/admin-service/order/order.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends BaseComponent implements OnInit {
  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  @ViewChild('dt') dt: any;
  public rangeDates: FormControl = new FormControl([new Date(), new Date()]);
  public dateFormat: string = 'dd/mm/yy';
  public maxDateValue: Date = new Date();

  public products: any = {};
  public status = [
    { name: 'All', code: 0 },
    { name: 'Pending', code: 1 },
    { name: 'Accepted', code: 2 },
    { name: 'In-transit', code: 3 },
    { name: 'Delivered', code: 4 },
    { name: 'Cancelled', code: 6 },
  ];
  public orderRequestParam: IOrderRequestModel | any;
  public orders$: Observable<any> = of({});
  public columns: any[] = [];
  public showPrint = false;
  public selectedData: any[] = [];
  public selectOrderStatusId$: Observable<number | null>;
  public selectTopBarSearchString$: Observable<string>;
  public searchControl: FormControl = new FormControl('');
  public loadMorePage: number | null;
  public dateChangeByUser: boolean = false;

  constructor(
    private router: Router,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private cdn: ChangeDetectorRef
  ) {
    super();
    this.setColumById(0);
    this.setOrderRequestParam();
  }

  public ngOnInit(): void {
    // this.getOrders(this.orderRequestParam);

    this.rangeDates.valueChanges
      .pipe(
        debounceTime(500),
        filter((date) => {
          return date && date.length === 2 && date[1] !== null;
        }),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (this.rangeDates.valid) {
          
          this.orderRequestParam = cloneDeep({
            ...this.orderRequestParam,
            // endPoint: this.dateConvection(res),
            searchTimeRange: this.dateConvection(res),
            PageNo: 1,
            PageSize: 10
          });
          if (this.orderRequestParam?.Status === 1 || this.orderRequestParam?.Status === 2) {
            this.dateChangeByUser = true;
          } else {
            this.dateChangeByUser = false;
          }
          this.getOrders(this.orderRequestParam);
        }
      });

    this.subjectService.apiCallStatusWise$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res && res?.statusId) {
          if (res?.statusId === 3 || res?.statusId === 4) {
            this.setColumById(res?.statusId);
          }
          this.orderRequestParam = {
            ...this.orderRequestParam,
            Status: res?.statusId,
          };
          this.getOrders(this.orderRequestParam);
          this.subjectService.setApiCallStatusWise(null);
        }
      });

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res || res?.length === 0) {
          this.orders$
            .pipe(take(1))
            .subscribe((orders) => {
              console.log(orders);
              console.log(res);
              // if (res.length === 0) {
              //   this.products = orders;
              // }
              if (+res) {
                this.products.lstorderDetails = orders.lstorderDetails.filter((f: any) => {
                  return (
                    f?.OrderID?.toString()?.includes(res) ||
                    f?.Mobile?.toString()?.includes(res) ||
                    f?.ShipmentId?.toString()?.includes(res)
                  );
                });
              } else {
                if (res.length) {
                  this.products.lstorderDetails = orders.lstorderDetails.filter((f: any) => {
                    return f?.ShopName?.toLowerCase()?.includes(
                      res.toLowerCase()
                    );
                  });
                }
              }
            });
        }
      });

    this.subjectService.saveFilterOnRedirection$
      .pipe(take(1))
      .subscribe((res) => {
        if (res?.topFilter) {
          console.log('res.top', res)
          this.orderRequestParam = res.topFilter;
          this.setColumById(this.orderRequestParam.Status);
          this.getOrders(this.orderRequestParam);
        } else {
          this.getOrders(this.orderRequestParam);
        }
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public setProduct(res: any): void {
    const newProduct = cloneDeep(res);
    newProduct.lstorderDetails.map((p: any) => {
      let newAddress = '';
      if (p.ShopAddressOne) newAddress += ' ' + p.ShopAddressOne;
      if (p.ShopAddressTwo) newAddress += ' ' + p.ShopAddressTwo;
      if (p.ShopAddressThree) newAddress += ' ' + p.ShopAddressThree;
      if (newAddress?.length) p['newAddress'] = newAddress;
    });
    this.products = newProduct;
    if (this.orderRequestParam.Status === 2) {
      this.subjectService.holdAcceptedOrderForSelected$
        .pipe(take(1))
        .subscribe((res) => {
          this.selectedData = [...this.selectedData, ...newProduct.lstorderDetails.filter((p: any) => p.OrderID === res)]
        })
      this.subjectService.holdAcceptedOrderIdsForSelcted$
        .pipe(take(1), filter(p => p && p.length))
        .subscribe((res) => {
          this.selectedData = [];
          res.forEach((ids: number) => {
            const find = newProduct.lstorderDetails.find((item: any) => item.OrderID === ids);
            if (find) {
              this.selectedData.push(find);
            }
          })
          this.subjectService.setHoldAcceptedOrderIdsForSelcted(null);
        })
    }
    
    
  }

  public setColumById(id: number) {
    if (id === 3) {
      this.columns = [
        { field: 'ShipmentId', header: 'SHIPMENT ID', sort: true },
        { field: 'OrderCount', header: 'ORDERS COUNT', sort: false },
        { field: 'ShipmentAmount', header: 'SHIPMENT AMOUNT', sort: true },
        { field: 'OrderDate', header: 'ORDER DATE', sort: true },
      ];
    } else if (id === 4) {
      this.columns = [
        { field: 'ShipmentId', header: 'SHIPMENT ID', sort: true },
        { field: 'OrderCount', header: 'ORDERS COUNT', sort: false },
        { field: 'ShipmentAmount', header: 'SHIPMENT AMOUNT', sort: true },
        { field: 'OrderDate', header: 'CREATED DATE', sort: true },
        { field: 'CloseDate', header: 'CLOSED DATE', sort: true },
      ];
    } else {
      this.columns = [
        { field: 'OrderID', header: 'ORDER ID', sort: true },
        { field: 'ShopName', header: 'NAME', sort: false },
        { field: 'ShopAddressOne', header: 'ADDRESS', sort: false },
        { field: 'Mobile', header: 'MOBILE', sort: false },
        { field: 'OrderAmount', header: 'ORDER AMT', sort: true },
        { field: 'OrderDate', header: 'ORDER DATE', sort: true },
        { field: 'Status', header: 'STATUS', sort: false },
      ];
    }
  }

  public setOrderRequestParam() {
    // this.orderRequestParam = {
    //   endPoint: 'OverAll',
    //   orderStatusId: 0,
    //   urlMiddlePoint: 'GetAllOrderDetails',
    // };
    this.orderRequestParam = {
      Status: 0,
      searchTimeRange: 'OverAll',
      PageNo: 1,
      PageSize: 10
    }
  }

  public dateChange(event: any): void {
    if (this.rangeDates.value[1]) {
      // If second date is selected
      this.dashboardCalendar.overlayVisible = false;
    }
  }

  public redirectToDetail(orderDetail: any): void {
    if (orderDetail && (orderDetail?.OrderID || orderDetail?.ShipmentId)) {
      const shippedOrDelivered = orderDetail?.Status === 'Shipped' || orderDetail?.Status === 'Delivered';
      if (shippedOrDelivered) {
        orderDetail['showElse'] = true;
      } else {
        orderDetail['showElse'] = false;
      }
      orderDetail['orderStatusId'] =
        orderDetail?.Status === 'Shipped'
          ? 3
          : orderDetail?.Status === 'Delivered'
            ? 4
            : this.orderRequestParam?.Status;
      this.subjectService.setOrderDetail(orderDetail);
      this.subjectService.setSaveFilterOnRedirection({
        topFilter: this.orderRequestParam,
        ...(this.searchControl.value && {
          searchString: this.searchControl.value,
        }),
      });
      if (shippedOrDelivered && this.orderRequestParam?.Status === 0) {
        orderDetail['OrderId'] = orderDetail.OrderID
        this.subjectService.setOrderDetailShipment(orderDetail);
        this.router.navigate(['/admin', 'order', 'detail', orderDetail?.ShipmentId, 's', orderDetail.OrderID]);
      } else {
        this.subjectService.setOrderDetail(orderDetail);
        this.router.navigate([
          '/admin',
          'order',
          'detail',
          orderDetail?.OrderID || orderDetail?.ShipmentId,
        ]);
      }
    }
  }

  public paginate(event: any): void {
    const pageNo = (event.first / event.rows) ? (event.first / event.rows) + 1 : 0 + 1;
    if (this.orderRequestParam.PageNo !== pageNo || this.orderRequestParam.PageSize !== event.rows) {
      const orderRequestParam = {
        Status: this.orderRequestParam.Status,
        searchTimeRange: this.orderRequestParam.searchTimeRange,
        PageNo: pageNo,
        PageSize: event.rows
      };
      this.getOrders(orderRequestParam);
    } else {
      const order = (event.sortOrder === 1) ? true : false;
      this.customSort(event.sortField, order);
    }
  }

  public customSort(field: string, order: boolean) {
    const localData = this.getOrdersLocal()
    if (localData) {
      const sortedData = this.ownSortCreate(cloneDeep(localData), field, order)
      this.setProduct(sortedData);
    }
  }

  public ownSortCreate(data: any, key: string, isAscending: boolean) {
    if(isAscending){ 
      data.lstorderDetails.sort((a: any, b: any) => (a[key] > b[key]) ? 1 : -1);
    }else{
      data.lstorderDetails.sort((a: any, b: any) => (a[key] > b[key]) ? -1 : 1);
    }
    return data;
  }

  public loadMore() {
    const data = this.getOrdersLocal();
    if (data && data.Next) {
      this.loadMorePage = (this.loadMorePage) ? this.loadMorePage + 1 : 1;
      this.orderRequestParam = {
        ...this.orderRequestParam,
        PageNo: this.loadMorePage
      }
      this.getOrders(this.orderRequestParam)
    }
  }

  public statusChange(statusId: number): void {
    const forAll = {
      Status: statusId,
      searchTimeRange: 'OverAll',
      PageNo: 1,
      PageSize: 10
    };
    this.setColumById(statusId);
    this.getOrders(forAll);
  }

  public export(tableId: string): void {
    const data = this.getOrdersLocal();
    if (data && data?.lstorderDetails?.length) {
      this.exportExcel(data?.lstorderDetails);
    }
  }

  public getOrdersLocal(): any {
    let data = null;
    this.orders$.pipe(take(1)).subscribe((res) => {
      data = res;
    });
    return data;
  }

  public getOrders(requestParam: any) {
    this.setLoader(true);
    this.adminOrderService
      .getOrdersServiceSingle(requestParam, this.getApiCallStatusWise(requestParam.Status))
      .subscribe((res) => {
        if (res && res.Status == 'OK') {
          console.log('orders', res?.Data)
          const data = res?.Data
          // const localData = this.getOrdersLocal()
          // if (localData && localData?.lstorderDetails?.length) {
          //   data.lstorderDetails = [...localData.lstorderDetails, ...data.lstorderDetails]
          // }
          this.orders$ = of(data);
          this.setProduct(data);
          this.setLoader(false);
        } else {
          this.toasterService.error(res?.ErrorMessage);
          this.setLoader(false);
        }
      });
  }

  public orderChange(orderStatusId: number, urlMiddlePoint: string) {
    this.orderRequestParam = {
      Status: orderStatusId,
      searchTimeRange: 'OverAll',
      PageNo: 1,
      PageSize: 10
    };
    this.selectedData = [];
    this.subjectService.setHoldAcceptedOrderForSelected(null);
    this.dt.first = 0;
    this.dt.rows = 10;
    if (orderStatusId === 1 || orderStatusId === 2) {
      this.loadMorePage = 1;
    } else {
      this.loadMorePage = null;
    }
    this.setColumById(orderStatusId);
    this.getOrders(this.orderRequestParam);
    if (orderStatusId === 3) {
      this.showPrint = true;
    } else {
      this.showPrint = false;
    }
  }

  public dateConvection(date: Array<Date>) {
    const first = date[0];
    const second = date[1];
    return (
      first.getDate() +
      ',' +
      (first.getMonth() + 1) +
      ',' +
      first.getFullYear() +
      '-' +
      second.getDate() +
      ',' +
      (second.getMonth() + 1) +
      ',' +
      second.getFullYear()
    );
  }

  public getApiCallStatusWise(key: number): string {
    switch (key) {
      case 3:
        return 'GetInTransitOrderDetails';
      case 4:
        return 'GetDeliveredOrderDetails';
      default:
        return 'GetAllOrderDetails';
    }
  }




  public resetSearch(): void {
    this.searchControl.setValue('');
  }

  public redirectToBulkAccept() {
    this.router.navigate(['/admin', 'order', 'bulk-accept']);
  }

  public createShipment() {
    if (this.selectedData && this.selectedData.length) {
      const allId: number[] = this.selectedData.map((p) => p.OrderID);
      this.subjectService.setHoldIdsForCreateShipment(allId);
      this.router.navigate(['/admin', 'order', 'review-shipment']);
    } else {
      this.toasterService.info('Select order first through checkbox.');
    }
  }
}
