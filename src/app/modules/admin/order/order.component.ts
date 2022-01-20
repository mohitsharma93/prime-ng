import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import {data} from './product-dummy';

interface Product {
  id?:string;
  name?:string;
  address?:string;
  mobile?:string;
  order_amt?:string;
  order_date?:string;
  status?:string;
}

@Component({
  selector: 'app-admin-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;
  public rangeDates: Date[];
  public dateFormat: string = 'dd M yy';
  public maxDateValue: Date = new Date();

  public products: Product[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.rangeDates = [new Date(), new Date()];
    this.products = data;
  }

  public dateChange(event: any): void {
    // console.log('this.rangeDates', this.rangeDates)
    if (this.rangeDates[1]) { // If second date is selected
      this.dashboardCalendar.overlayVisible=false;
    }
  }

  public redirectToDetail(id: string): void {
    if (id) {
      this.router.navigate(['/admin', 'order-detail', id])
    }
  }

}
