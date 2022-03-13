import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  public getOrderDetailService(endPoint: string): Observable<any> {
    return this.http
      .get(AdminOrderUrls.getOrders(this.adminBaseUrl) + '' + endPoint)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }
}
