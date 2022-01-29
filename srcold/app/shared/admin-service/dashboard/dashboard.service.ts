import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpWrapperService } from '../httpWrapper';
import { AdminDashboardAnalyticsUrls } from '../urls/dashboard';

@Injectable()
export class AdminDashboardService {

  constructor(
    @Inject('ADMIN_API_URL') private adminBaseUrl: string,
    private http: HttpWrapperService
  ) { }


  public getDashboardAnalyticsService(endPoint: string): Observable<any> {
    return this.http
      .get(AdminDashboardAnalyticsUrls.getDashboardAnalytics(this.adminBaseUrl) +''+ endPoint)
      .pipe(
        map((res) => {
          const data: any = res;
          return data;
        })
      );
  }
}
