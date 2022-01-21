import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActiveUserService } from '../services/active-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(private activeUserService: ActiveUserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.activeUserService.getToken();
    const user: any = this.activeUserService.getUser();
    const isLoggedIn = user && user.AspNetuserId && token;
    const isApiUrl = request.url.startsWith(environment.API_ENDPOINT);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request);
  }
}
