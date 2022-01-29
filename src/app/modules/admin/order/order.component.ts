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
import { debounceTime, distinctUntilChanged, filter, Observable, of, takeUntil } from 'rxjs';
import { BaseComponent } from '../base.component';
import { cloneDeep, isEqual } from 'lodash-es';
import { orders } from './ngrx/selector/order.selector';

@Component({
  selector: 'app-admin-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: FormControl = new FormControl('');
  public dateFormat: string = 'dd M yy';
  public maxDateValue: Date = new Date();

  public products: any[] = [];
  public status = [
    { name: 'Approved', code: 'approved' },
  ];
  public orderRequestParam: IOrderRequestModel ;
  public orders$: Observable<any[]> = of([]);

  constructor(
    private router: Router,
    private store: Store<IAppState>,
  ) {
    super();
    this.orders$ = this.store.pipe(
      select(orders),
      distinctUntilChanged(isEqual),
      takeUntil(this.destroy$)
    );
  }

  public ngOnInit(): void {
    this.setOrderRequestParam();
    this.getOrders(this.orderRequestParam);

    this.orders$.subscribe(res => {
      console.log(res)
      if (res && res?.length) {
        this.products = cloneDeep(res);
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
    })
  }

  public ngOnDestroy(): void {
    // super.ngOnDestroy();
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

  public export(): void {
    console.log('in export')
  }

  public getOrders(requestParam: IOrderRequestModel) {
    this.store.dispatch(actions.getOrderAction({ request: requestParam }))
  }

  public orderChange(orderStatusId: number, urlMiddlePoint: string) {
    this.orderRequestParam = {
      endPoint: 'OverAll',
      orderStatusId: orderStatusId,
      urlMiddlePoint: urlMiddlePoint
    }
    this.getOrders(this.orderRequestParam)
  }

  public dateConvection(date: Array<Date>) {
    return (date[0].getMonth() + 1) + ',' + date[0].getFullYear() + '-' + (date[1].getMonth() + 1 ) + ',' + date[1].getFullYear()
  }

}
