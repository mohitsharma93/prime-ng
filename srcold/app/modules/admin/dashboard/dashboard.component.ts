import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: Date[];
  public dateFormat: string = 'dd M yy';
  public maxDateValue: Date = new Date();
  public chartData: any;
  public graphLabelDetail: any[] = []
  public chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: 60,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
  };
  public graphColor = [ "#21d59b", "#0058ff", "#f0142f", "#f99600", "#ffc700"]

  constructor() {
    
  }

  ngOnInit(): void {
    this.rangeDates = [new Date(), new Date()];
    this.setChartData();
    this.setGraphLabelDetail();
  }

  public dateChange(event: any): void {
    // console.log('this.rangeDates', this.rangeDates)
    if (this.rangeDates[1]) { // If second date is selected
      this.dashboardCalendar.overlayVisible=false;
    }
  }

  public setChartData() {
    this.chartData = {
      // labels: ["Accepted", "Pending", "Cancelled", "Delivered", "Shipped"],
      datasets: [
        {
          data: [55, 63, 20, 24, 25],
          backgroundColor: this.graphColor,
          hoverBackgroundColor: this.graphColor
        }
      ]
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
