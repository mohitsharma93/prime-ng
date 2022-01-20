import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: Date[];
  public maxDateValue: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

  public dateChange(event: any): void {
    // console.log('this.rangeDates', this.rangeDates)
    if (this.rangeDates[1]) { // If second date is selected
      this.dashboardCalendar.overlayVisible=false;
  }
  }
}
