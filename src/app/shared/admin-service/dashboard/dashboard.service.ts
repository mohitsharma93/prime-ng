import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { HttpWrapperService } from '../httpWrapper';
import { AdminDashboardAnalyticsUrls } from '../urls/dashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(
    @Inject('ADMIN_API_URL') private adminBaseUrl: string,
    private http: HttpWrapperService,
    private toasterService: ToasterService,
    
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
