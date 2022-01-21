import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // how to hilight doughunt chart section on click of button
  // https://stackoverflow.com/questions/31033248/highlight-area-programmatically-chart-js
  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: Date[];
  public dateFormat: string = 'dd M yy';
  public maxDateValue: Date = new Date();
  public chartData: any;
  public graphLabelDetail: any[] = []
  public graphColor = [ "#21d59b", "#0058ff", "#f0142f", "#f99600", "#ffc700"]
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

  constructor() {
    
  }

  ngOnInit(): void {
    this.rangeDates = [new Date(this.maxDateValue.getFullYear(), this.maxDateValue.getMonth() - 3, 1), new Date()];
    this.setChartData();
    this.setGraphLabelDetail();
  }

  public dateChange(event: any): void {
    if (this.rangeDates[1]) {
      this.dashboardCalendar.overlayVisible=false;
    }
  }

  public setChartData() {
    this.chartData = {
      labels: ["Accepted", "Pending", "Cancelled", "Delivered", "Shipped"],
      datasets: [
        {
          data: [55, 63, 20, 24, 25],
          backgroundColor: this.graphColor,
          hoverBackgroundColor: this.graphColor
        }
      ],
    }
  }

  public setGraphLabelDetail() {
    this.graphLabelDetail = [
      { status: 'Pending', first: '600', second: '23242424' },
      { status: 'Accepted', first: '27', second: '234234234' },
      { status: 'Shipped', first: '22', second: '24234234' },
      { status: 'Delivered', first: '2505', second: '23424234' },
      { status: 'Cancelled', first: '720', second: '234234234' },      
    ]
  }
}
