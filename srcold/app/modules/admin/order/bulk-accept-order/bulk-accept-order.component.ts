import { Component, OnInit } from "@angular/core"
import {Location} from '@angular/common';
import { animate, state, style, transition, trigger } from "@angular/animations";


import { BaseComponent } from "../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take } from "rxjs";

@Component({
  selector: 'app-admin-bulk-accept-order',
  templateUrl: './bulk-accept-order.component.html',
  styleUrls: ['./bulk-accept-order.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class BulkAcceptOrderComponent extends BaseComponent implements OnInit {

  public cancelModelShow: boolean = false;
  public columns: any[] = [];
  public orders$: Observable<any[]>;
  public expandedRows: any = {};
  public isExpanded: boolean = false;

  constructor(
    private _location: Location,
  ) {
    super();
    this.setColumById();
    this.orders$ = of(dummyData)
  }

  ngOnInit() {

  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'SNo', header: 'S.NO.'},
      { field: 'ItemName', header: 'ITEM NAME'},
      { field: 'NetQuantity', header: 'NET QUANTITY'},
      { field: 'Orders', header: 'ORDERS'},
      { field: 'OrderAmount', header: 'DISPATCH QUANTITY' },
    ]
  }

  public expandAll() {
    if(!this.isExpanded){
      this.orders$.pipe(take(1)).subscribe(res => {
        if (res && res.length) {
          res.forEach(order => {
            this.expandedRows[order.ItemName] = true;
          })
        }
      })
    } else {
      this.expandedRows={};
    }
    this.isExpanded = !this.isExpanded;
  }

  public cancelOrder(showHideModel: boolean, selectedOrder: any): void {
    this.cancelModelShow = showHideModel;
    if (selectedOrder && Object.keys(selectedOrder).length) {
      console.log('selectedOrder', selectedOrder)
    }
  }

  public hitCancelOrderApi(): void {
    
  }
}