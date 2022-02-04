import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IOrderCancelModel, IOrderQuantityUpdateModel } from 'src/app/models/admin/order';
import { HttpWrapperService } from '../httpWrapper';
import { AdminOrderUrls } from '../urls/order';

@Injectable()
export class AdminOrderService {

  constructor(
    @Inject('ADMIN_API_URL') private adminBaseUrl: string,
    private http: HttpWrapperService
  ) { }


  public getOrdersService(endPoint: string, orderStatusId: number, urlMiddlePoint: string): Observable<any> {
    return this.http
      .get(
        AdminOrderUrls.getOrders(this.adminBaseUrl + '/' + urlMiddlePoint).replace(':orderStatusId', orderStatusId.toString()) + '' + endPoint
      )
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public getOrderDetailRecordService(orderId: number): Observable<any> {
    return this.http
      .get(AdminOrderUrls.getOrderDetailRecord(this.adminBaseUrl).replace(':orderId', orderId.toString()))
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public cancelOrderService(request: IOrderCancelModel): Observable<any> {
    return this.http
      .post(AdminOrderUrls.cancelOrder(this.adminBaseUrl), request)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public updateQuantityService(request: IOrderQuantityUpdateModel): Observable<any> {
    return this.http
      .post(AdminOrderUrls.updateQuantity(this.adminBaseUrl), request)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }
}
