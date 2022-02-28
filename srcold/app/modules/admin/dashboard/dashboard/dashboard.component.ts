import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Observable, of, takeUntil } from 'rxjs';
import { pick } from 'lodash-es';
import { BaseComponent } from '../../base.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { AdminDashboardService } from 'src/app/shared/admin-service/dashboard/dashboard.service';
import { SubjectService } from 'src/app/shared/admin-service/subject.service';
import { DataService } from 'src/app/shared/services/data.service';
import { IDashboardAnalytics } from 'src/app/models/admin/dashboard';

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
  public dateFormat: string = 'dd/mm/yy';
  maxDateRange: Date = new Date();
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
  public dashboardAnalytics$: Observable<any> = of({} as IDashboardAnalytics);
  totalPreviousOrder: number;
  totalPreviousSale: number;
  PreviousOrder_perce:number;
  PreviousSale_perce:number;

  constructor(
    private router: Router,
    private adminDashboardService: AdminDashboardService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private ds: DataService
  ) {
    super()
    this.getDashboardAnalytics(this.selectedFilter);
    this.getChartData();
  }

  ngOnInit(): void {
    this.rangeDates.valueChanges.pipe(
      debounceTime(500),
      filter(date => {
        if (date && date.length === 2 && date[1] == null) {
          this.updateMaxDateRange(this.rangeDates.value[0]);
        }
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
    this.adminDashboardService.getDashboardAnalyticsService(filter).subscribe(res => {
      console.log("dashboard" ,res)
      if (res && res.Status == 'OK') {
        // this.setGraphLabelDetail(res?.Data);
        this.dashboardAnalytics$ = of(res?.Data)
        this.totalPreviousSale = res?.Data['TotalPreviousSale'] || 0;
        this.totalPreviousOrder = res?.Data['TotalPreviousOrder'] || 0;
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    })
  }

  getChartData() {
    const req = {
      url: '/api/sellerDashboard/ShopOverview/GetSellerDashboardPieChartInfo',
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        this.setGraphLabelDetail(res?.Data);
      }
    });
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
      { status: 'Pending', count: data['PendingOrdersCount'], sum: data['PendingOrdersSum'], statusId: 1 },
      { status: 'Accepted', count: data['AcceptedOrdersCount'], sum: data['AcceptedOrdersSum'], statusId: 2 },
      { status: 'Shipped', count: data['ShippedOrdersCount'], sum: data['ShippedOrdersSum'], statusId: 3 },
      { status: 'Delivered', count: data['DeliveredOrdersCount'], sum: data['DeliveredOrdersSum'], statusId: 4 },
      { status: 'Cancelled', count: data['CancelledOrdersCount'], sum: data['CancelledOrdersSum'], statusId: 6 },

    ];
    const d = pick(data, ['AcceptedOrdersCount', 'PendingOrdersCount', 'CancelledOrdersCount', 'DeliveredOrdersCount', 'ShippedOrdersCount'])

    this.setChartData(Object.values(d))
  }

  public dateConvection(date: Array<Date>): string {
    return date[0].getDate() + ',' + (date[0].getMonth() + 1) + ',' + date[0].getFullYear() + '-' + date[1].getDate() + ',' + (date[1].getMonth() + 1) + ',' + date[1].getFullYear()
  }

  public redirectToOrder(statusId: number): void {
    this.router.navigate(['/admin', 'order']);
    this.subjectService.setApiCallStatusWise({ statusId: statusId });
  }

  updateMaxDateRange(d: Date) {
    let sDate = new Date(d);
    let sMonth = sDate.getMonth();
    let sYear = sDate.getFullYear();
    this.maxDateRange.setDate(sDate.getDate());
    this.maxDateRange.setMonth(sMonth + 3);
    if (sMonth == 11 || sMonth == 22) {
      this.maxDateRange.setFullYear(sYear + 1);
    } else {
      this.maxDateRange.setFullYear(sYear);
    }

  }
}

