import { ChangeDetectorRef, Component, OnInit } from "@angular/core"
import { Location } from '@angular/common';

import { BaseComponent } from "../../../base.component";
import { dummyData } from "./dummy";
import { Observable, of, take, takeUntil } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { AdminOrderService } from "src/app/shared/admin-service/order/order.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { SubjectService } from "src/app/shared/admin-service/subject.service";
import { DataService } from "src/app/shared/services/data.service";
import { DialogService } from "primeng/dynamicdialog";
import { PrintModelComponent } from "src/app/modules/print-model/print-model.component";
import { Router } from "@angular/router";
import { uniq } from "lodash-es";

@Component({
  selector: 'app-admin-confirmation-bulk-accept',
  templateUrl: './confirmation-bulk-accept.component.html',
  styleUrls: ['./confirmation-bulk-accept.component.scss'],
})
export class ConfirmationBulkAcceptComponent extends BaseComponent implements OnInit {

  public columns: any[] = [];
  public orders$: Observable<any[]>;
  public selectedData: any[] = [];
  public cancelReasonControl: FormControl = new FormControl('', [Validators.required]);
  public cancelModelShow: boolean = false;
  public orderValue$: Observable<any>

  constructor(
    private _location: Location,
    private adminOrderService: AdminOrderService,
    private toasterService: ToasterService,
    private subjectService: SubjectService,
    private dialogService: DialogService,
    private ds: DataService,
    private router: Router,
    private cdn: ChangeDetectorRef
  ) {
    super();
    this.setColumById();
    // this.orders$ = of(dummyData)
  }

  ngOnInit() {
    this.subjectService.holdBulkDataForNext$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && res?.length) {
        console.log('holdBulkDataForNext', res);
        const newRes = res.reduce((acc: any[], value: any) => {
          if (value?.expandedRow?.length > 3) {
            value.showView = true;
          } else {
            value.showView = false;
          }
          value.expandedRow.forEach((obj: any, index: number) => {
            if (index < 3) {
              obj.show = true;
            } else {
              obj.show = false;
            }
          })
          acc.push(value);
          return acc;
        }, []);
        this.orders$ = of(newRes);
      }
    })
    this.subjectService.oldOrderCountSumForConfirmScreen$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res && Object.keys(res)?.length) {
        this.orderValue$ = of(res);
        // this.subjectService.setHoldOrderCountSumForConfirmScreen(null)
      }
    })
  }

  public backClicked(): void {
    this._location.back();
  }

  public setColumById() {
    this.columns = [
      { field: 'ItemName', header: 'ITEM NAME' },
      { field: 'DispatchQuantity', header: 'QUANTITY' },
      { field: 'expandedRow', header: 'ORDER WISE QUANTITY' },
    ]
  }

  public acceptBulkOrder() {
    console.log('in accept bulk order')
    const allOrderId: number[] = this.getUniqueOrderIds();
    this.adminOrderService.bulkOrderAddtoAcceptService(allOrderId).subscribe(res => {
      console.log('res', res)
      if (res && res?.Status == 'OK') {
        // this.backClicked();
        this.subjectService.setHoldAcceptedOrderIdsForSelcted(allOrderId);
        this.redirectToOrder();
      } else {
        this.toasterService.error(res?.ErrorMessage);
      }
    });
  }

  show() {
    const req = {
      url: '/api/sellerDashboard/ShopOverview/GetBulkAcceptOrderData',
      params: '',
    };
    this.ds.get(req).subscribe((res: any) => {
      if (res.Status === 'OK') {
        const ref = this.dialogService.open(PrintModelComponent, {
          data: res.Data,
          width: '70%',
          height: '70%'
        });
      }
    });
  }

  public redirectToOrder() {
    const filter = this.subjectService.saveFilterOnRedirection.value;
    const obj = {
      topFilter: {
        Status: 2,
        searchTimeRange: 'OverAll',
        PageNo: 1,
        PageSize: 25,
        sortField: filter?.sortField || 'OverAll',
        sortOrder: filter?.sortOrder || 1,
        SerchParameter: filter?.SerchParameter || '',
        OrderIdSerchParameter: filter?.OrderIdSerchParameter || 0,
      }
    }

    this.subjectService.setSaveFilterOnRedirection(obj);
    this.router.navigate(['/admin', 'order'])
  }

  public getUniqueOrderIds() {
    let ids: number[] = [];
    this.orders$.pipe(take(1)).subscribe(res => {
      if (res && res?.length) {
        ids = res.reduce((acc, { expandedRow }) => {
          const ids = expandedRow.map(({ OrderId }: { OrderId: number }) => OrderId);
          return [...acc, ...ids];
        }, []);
      }
    })
    return uniq(ids);
  }

  public refreshData(rowData: any) {
    rowData.expandedRow.map((obj : any) => obj.show = true);
  }
}