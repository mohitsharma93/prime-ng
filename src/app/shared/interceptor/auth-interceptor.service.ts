import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveUserService } from '../services/active-user.service';
import { EncryptionService } from '../services/encryption.service';
import { ToasterService } from '../services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    private activeUserService: ActiveUserService,
    private router: Router,
    private encryptionService: EncryptionService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('innn request');
    const token = this.activeUserService.getToken();
    const user: any = this.activeUserService.getUser();
    const isLoggedIn = user && user.AspNetuserId && token;
    const isApiUrl = request.url.startsWith(environment.API_ENDPOINT);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(

      tap(event => {
      }, error => {
        if (error.status == 401) {
          if (!(request.url.indexOf('/login') > -1)) {
            localStorage.removeItem('token');
            this.router.navigateByUrl('/auth/login');
          }
        }
      })
      , map((event: any) => {
        event = this.encryptionService.decrypt(event);
        return event;
      }, (error: any) => {
        if (error.status == 401) {

        }
      })
    );
  }
}



