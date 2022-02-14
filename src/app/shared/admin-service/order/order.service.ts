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
    let url = AdminOrderUrls.getOrders(this.adminBaseUrl + '/' + urlMiddlePoint)
    if (urlMiddlePoint === 'GetInTransitOrderDetails' || urlMiddlePoint === 'GetDeliveredOrderDetails') {
      url = url.slice(0, url.length - 15)
    } else {
      url = url.replace(':orderStatusId', orderStatusId.toString())
    }
    return this.http
      .get(
        url + '' + endPoint
      )
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public getOrderDetailRecordService(orderId: number, urlMiddlePoint: string): Observable<any> {
    return this.http
      .get(AdminOrderUrls.getOrderDetailRecord(this.adminBaseUrl+ '/' + urlMiddlePoint).replace(':orderId', orderId.toString()))
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

  public acceptOrderService(orderId: any): Observable<any> {
    return this.http
      .post(AdminOrderUrls.acceptOrder(this.adminBaseUrl).replace(':orderId', orderId), {})
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public addBulkToShipmentService(allIds: number[]): Observable<any> {
    return this.http
      .post(AdminOrderUrls.addBulkToShipmentOrder(this.adminBaseUrl), allIds)
      .pipe(
        map((res) => {
          const data: any = res;
          // console.log(data)
          return data;
        })
      );
  }

  public addToShipmentService(orderId: any): Observable<any> {
    return this.http
      .post(AdminOrderUrls.addToShipmentOrder(this.adminBaseUrl).replace(':orderId', orderId.toString()), {})
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public addToDeliveredService(orderId: any): Observable<any> {
    return this.http
      .post(AdminOrderUrls.addToDeliveredOrder(this.adminBaseUrl).replace(':orderId', orderId), {})
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public deliveredSelectedService(idsToBeDelivered: number[]): Observable<any> {
    return this.http
      .post(AdminOrderUrls.deliveredSelected(this.adminBaseUrl), idsToBeDelivered)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }

  public canceledSelectedService(remark: string, idsToBeCancel: number[]): Observable<any> {
    return this.http
      .post(AdminOrderUrls.canceledSelected(this.adminBaseUrl).replace(':remark', remark), idsToBeCancel)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }
  public getBulkAcceptedOrderService(): Observable<any> {
    return this.http
      .get(AdminOrderUrls.getBulkAcceptOrderData(this.adminBaseUrl))
      .pipe(
        map(res => {
          const data: any = res;
          return data;
        })
      )
  }
  public deliveredOrder(orderId: string, data: any): Observable<any> {
    return this.http
      .post(AdminOrderUrls.deliveredOrder(this.adminBaseUrl).replace(':orderId', orderId.toString()), data)
      .pipe(
        map(res => {
          const data: any = res;
          return data;
        })
      )
  }
  public getReviewShipmentService(): Observable<any> {
    return this.http
      .get(AdminOrderUrls.getReviewShipment(this.adminBaseUrl))
      .pipe(
        map(res => {
          const data: any = res;
          return data;
        })
      )
  }
}
