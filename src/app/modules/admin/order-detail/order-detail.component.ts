import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Location} from '@angular/common';
import {data} from '../order/product-dummy';

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
  selector: 'app-admin-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  @ViewChild('dashboardCalendar') dashboardCalendar: any;

  public products: Product[] = [];
  public routeParam: Params;

  public cancelModelShow: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private actRoute: ActivatedRoute,
    private _location: Location
  ) {
    this.actRoute.params.subscribe(res => {
      this.routeParam = res;
      console.log('this.routeParam', this.routeParam)
    })

  }

  public ngOnInit(): void {
    this.products = data;
  }

  public backClicked(): void {
    this._location.back();
  }

  public redirectToDetail(id: string): void {
    if (id) {
      this.router.navigate(['/admin', 'order-detail', id])
    }
  }

  public cancelOrder(showHideModel: boolean): void {
    this.cancelModelShow = showHideModel
  }

}
