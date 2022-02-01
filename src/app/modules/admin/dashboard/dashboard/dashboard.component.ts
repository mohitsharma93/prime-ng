import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, Observable, takeUntil } from 'rxjs';
import { isEqual, pick } from 'lodash-es';

import { IAppState } from 'src/app/store/app.state';
import { BaseComponent } from '../../base.component';

import { getDashboardAnalyticTypeAction } from '../ngrx/actions/dashboard.actions';
import { dashboardAnalytics } from '../ngrx/selector/dashboard.selector';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { setGetOrderStatusId } from '../../../../store/actions/root.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: FormControl = new FormControl(
    [new Date(), new Date()]
  );
  public dateFormat: string = 'M, yy';
  public maxDateValue: Date = new Date();
  public chartData: any;
  public graphLabelDetail: any[] = []
  public graphColor = ["#21d59b", "#0058ff", "#f0142f", "#f99600", "#ffc700"]
  public chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: 60,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  public selectedFilter: string = 'Today'
  public dashboardAnalytics$: Observable<any>;

  constructor(
    private store: Store<IAppState>,
    private router: Router
  ) {
    super()
    this.getDashboardAnalytics(this.selectedFilter);
    this.dashboardAnalytics$ = this.store.pipe(
      select(dashboardAnalytics),
      distinctUntilChanged(isEqual),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // this.rangeDates = [new Date(this.maxDateValue.getFullYear(), this.maxDateValue.getMonth() - 3, 1), new Date()];
    this.dashboardAnalytics$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && Object.keys(res).length) {
        this.setGraphLabelDetail(res);
      }
    });
    this.rangeDates.valueChanges.pipe(
      debounceTime(500),
      filter(date => {
        return date && date.length === 2 && date[1] !== null
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      if (this.rangeDates.valid) {
        this.getDashboardAnalytics(this.dateConvection(res))
      }
    })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public getDashboardAnalytics(filter: string): void {
    this.selectedFilter = filter;
    this.store.dispatch(getDashboardAnalyticTypeAction({ request: filter }))
  }

  public dateChange(event: any): void {
    if (this.rangeDates.value[1]) {
      this.dashboardCalendar.overlayVisible = false;
    }
  }

  public setChartData(data: any) {
    this.chartData = {
      labels: ["Accepted", "Pending", "Cancelled", "Delivered", "Shipped"],
      datasets: [
        {
          data: data,
          backgroundColor: this.graphColor,
          hoverBackgroundColor: this.graphColor
        }
      ],
    }
  }

  public setGraphLabelDetail(data: { [key: string]: string }) {
    this.graphLabelDetail = [
      { status: 'Pending', count: data['PendingOrdersCount'], sum: data['PendingOrdersSum'], statusId: 1},
      { status: 'Accepted', count: data['AcceptedOrdersCount'], sum: data['AcceptedOrdersSum'], statusId: 2 },
      { status: 'Shipped', count: data['ShippedOrdersCount'], sum: data['ShippedOrdersSum'], statusId: 3 },
      { status: 'Delivered', count: data['DeliveredOrdersCount'], sum: data['DeliveredOrdersSum'], statusId: 4 },
      { status: 'Cancelled', count: data['CancelledOrdersCount'], sum: data['CancelledOrdersSum'], statusId: 6 },
      
    ];
    const d = pick(data, ['AcceptedOrdersCount', 'PendingOrdersCount', 'CancelledOrdersCount', 'DeliveredOrdersCount', 'ShippedOrdersCount'])

    this.setChartData(Object.values(d))
  }

  public dateConvection(date : Array<Date>): string {
    return (date[0].getMonth() + 1) + ',' + date[0].getFullYear() + '-' + (date[1].getMonth() + 1 ) + ',' + date[1].getFullYear()
  }

  public redirectToOrder(statusId: number): void {
    this.store.dispatch(setGetOrderStatusId({ response: statusId }))
    this.router.navigate(['/admin', 'order']);
  }
}
