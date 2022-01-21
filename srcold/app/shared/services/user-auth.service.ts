import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.API_ENDPOINT;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  loginUser(req: any) {
    const url = this.baseUrl + req.url;
    return this.http.post(url, req.params, this.httpOptions).pipe(
      map((response: any) => response),
      catchError((err) => {
        if (err.status === 500 && err.error && err.error.auth === false) {
          console.log(err);
        }
        return throwError(err);
      })
    );
  }

}
