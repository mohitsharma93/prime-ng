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
  public chartOptions: any;

  constructor() {
    
  }

  ngOnInit(): void {
    this.rangeDates = [new Date(), new Date()];
    this.setChartData();
  }

  public dateChange(event: any): void {
    // console.log('this.rangeDates', this.rangeDates)
    if (this.rangeDates[1]) { // If second date is selected
      this.dashboardCalendar.overlayVisible=false;
    }
  }

  public setChartData() {
    this.chartData = {
      labels: ["Accepted", "Pending", "Cancelled", "Delivered", "Shipped"],
      datasets: [
        {
          data: [55, 63, 20, 24, 25],
          backgroundColor: [
            "#21d59b",
            "#0058ff",
            "#f0142f",
            "#f99600",
            "#ffc700"
          ],
          hoverBackgroundColor: [
            "#21d59b",
            "#0058ff",
            "#f0142f",
            "#f99600",
            "#ffc700"
          ]
      }
      ]
    }
  }
}
