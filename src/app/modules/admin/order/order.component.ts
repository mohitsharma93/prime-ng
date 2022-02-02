import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { PrimeNGConfig } from 'primeng/api';
import { IAppState } from 'src/app/store/app.state';
import { data } from './product-dummy';
import * as actions from './ngrx/actions/order.actions';
import { IOrderRequestModel } from 'src/app/models/admin/order';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable, of, skip, take, takeUntil } from 'rxjs';
import { BaseComponent } from '../base.component';
import { cloneDeep, isEqual } from 'lodash-es';
import { orders } from './ngrx/selector/order.selector';
import { selectOrderStatusId, selectTopBarSearchString } from 'src/app/store/selector';
import { setGetOrderStatusId } from 'src/app/store/actions/root.actions';
import { AdminOrderService } from 'src/app/shared/admin-service/dashboard/order.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: FormControl = new FormControl(
    [new Date(), new Date()]
  );
  public dateFormat: string = 'M, yy';
  public maxDateValue: Date = new Date();

  public products: any[] = [];
  public status = [
    { name: 'Approved', code: 'approved' },
  ];
  public orderRequestParam: IOrderRequestModel;
  public orders$: Observable<any[]> = of([]);
  public columns: any[] = [];
  public showPrint = false;
  public selectedData: any[] = [];
  public selectOrderStatusId$: Observable<number | null>;
  public selectTopBarSearchString$: Observable<string>;

  constructor(
    private router: Router,
    private store: Store<IAppState>,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService
  ) {
    super();
    this.setColumById(0);
    this.setOrderRequestParam();
    // this.orders$ = this.store.pipe(
    //   select(orders),
    //   distinctUntilChanged(isEqual),
    //   takeUntil(this.destroy$)
    // );
    this.selectOrderStatusId$ = this.store.pipe(
      select(selectOrderStatusId),
      distinctUntilChanged(isEqual),
      takeUntil(this.destroy$)
    );
    this.selectTopBarSearchString$ = this.store.pipe(
      select(selectTopBarSearchString),
      distinctUntilChanged(isEqual),
      takeUntil(this.destroy$)
    );
  }

  public ngOnInit(): void {
    this.getOrders(this.orderRequestParam);
    this.selectOrderStatusId$.subscribe(res => {
      if (res) {
        if (res === 3 || res === 4) {
          this.setColumById(res);
        }
        this.orderRequestParam = {
          ...this.orderRequestParam,
          orderStatusId: res,
          urlMiddlePoint: this.getApiCallStatusWise(res)
        }
        this.getOrders(this.orderRequestParam);
        this.store.dispatch(setGetOrderStatusId({ response: null }))
      }
    })

    this.orders$.subscribe(res => {
      console.log('inn orders', res)
      if (res && res?.length) {
        this.setProduct(res);
      }
    })

    this.rangeDates.valueChanges.pipe(
      debounceTime(500),
      filter(date => {
        return date && date.length === 2 && date[1] !== null
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (this.rangeDates.valid) {
        this.orderRequestParam = cloneDeep({
          ...this.orderRequestParam,
          endPoint: this.dateConvection(res)
        });
        this.getOrders(this.orderRequestParam);
      }
    });

    this.selectTopBarSearchString$.subscribe((res: string) => {
      if (res || res?.length === 0) {
        this.orders$.pipe(take(1), takeUntil(this.destroy$)).subscribe(orders => {
          if (res.length === 0) {
            this.products = orders;
          }
          if (+res) {
            this.products = orders.filter(f => {
              return f?.OrderID?.toString()?.includes(res) || f?.Mobile?.toString()?.includes(res);
            });
          } else {
            this.products = orders.filter(f => {
              return f?.ShopName?.toLowerCase()?.includes(res.toLowerCase());
            });
          }
        })
      }
    })
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public setProduct(res: any) : void {
    const newProduct = cloneDeep(res)
    newProduct.map((p: any) => {
      let newAddress = ''
      if (p.ShopAddressOne) newAddress += ' ' + p.ShopAddressOne;
      if (p.ShopAddressTwo) newAddress += ' ' + p.ShopAddressTwo;
      if (p.ShopAddressThree) newAddress += ' ' + p.ShopAddressThree;
      if (newAddress?.length) p['newAddress'] = newAddress
    })
    this.products = newProduct;
  }

  public setColumById(id: number) {
    if (id === 3) {
      this.columns = [
        { field: 'ShipmentID', header: 'SHIPMENT ID', sort: true },
        { field: 'ShipmentCount', header: 'ORDERS COUNT', sort: false },
        { field: 'OrderAmount', header: 'SHIPMENT AMOUNT', sort: true },
        { field: 'OrderDate', header: 'CREATED DATE', sort: true }
      ]
    } else if (id === 4) {
      this.columns = [
        { field: 'ShipmentID', header: 'SHIPMENT ID', sort: true },
        { field: 'ShipmentCount', header: 'ORDERS COUNT', sort: false },
        { field: 'OrderAmount', header: 'SHIPMENT AMOUNT', sort: true },
        { field: 'OrderDate', header: 'CREATED DATE', sort: true },
        { field: 'CloseDate', header: 'CLOSED DATE', sort: true }
      ]
    } else {
      this.columns = [
        { field: 'OrderID', header: 'ORDER ID', sort: true },
        { field: 'ShopName', header: 'NAME', sort: false },
        { field: 'ShopAddressOne', header: 'ADDRESS', sort: false },
        { field: 'Mobile', header: 'MOBILE', sort: false },
        { field: 'OrderAmount', header: 'ORDER AMT', sort: true },
        { field: 'OrderDate', header: 'ORDER DATE', sort: true },
        { field: 'Status', header: 'STATUS', sort: false },
      ]
    }
  }

  public setOrderRequestParam() {
    this.orderRequestParam = {
      endPoint: 'OverAll',
      orderStatusId: 0,
      urlMiddlePoint: 'GetAllOrderDetails'
    }
  }

  public dateChange(event: any): void {
    if (this.rangeDates.value[1]) { // If second date is selected
      this.dashboardCalendar.overlayVisible = false;
    }
  }

  public redirectToDetail(id: string): void {
    if (id) {
      this.router.navigate(['/admin', 'order', 'detail', id]);
    }
  }

  public paginate(event: any): void {
    console.log('event', event);
  }

  public statusChange(event: any): void {
    console.log('status change', event)
  }

  public export(tableId: string): void {
    const data = this.getOrdersLocal();
    if (data && data.length) {
      this.exportExcel(data);
    }
  }

  public getOrdersLocal(): any {
    let data = null;
    this.orders$.pipe(take(1)).subscribe(res => {
      data = res
    })
    return data;
  }

  public getOrders(requestParam: IOrderRequestModel) {
    // this.store.dispatch(actions.getOrderAction({ request: requestParam }))
    this.adminOrderService.getOrdersService(requestParam.endPoint, requestParam.orderStatusId, requestParam.urlMiddlePoint).subscribe(res => {
      console.log('res', res)
      if (res && res.Status == 'OK') {
        this.orders$ = of(res?.Data);
        this.setProduct(res?.Data);
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }

  public orderChange(orderStatusId: number, urlMiddlePoint: string) {
    this.setColumById(orderStatusId)
    this.orderRequestParam = {
      endPoint: 'OverAll',
      orderStatusId: orderStatusId,
      urlMiddlePoint: urlMiddlePoint
    }
    this.getOrders(this.orderRequestParam);
    if (orderStatusId === 3) {
      this.showPrint = true;
    } else {
      this.showPrint = false;
    }
  }

  public dateConvection(date: Array<Date>) {
    return (date[0].getMonth() + 1) + ',' + date[0].getFullYear() + '-' + (date[1].getMonth() + 1) + ',' + date[1].getFullYear()
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

}
