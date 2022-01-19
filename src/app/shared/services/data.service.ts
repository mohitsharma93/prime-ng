import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ActiveUserService } from './active-user.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string;
  API_ENDPOINT: any

  constructor(
    private http: HttpClient,
    private aus: ActiveUserService
  ) {
    this.baseUrl = environment.API_ENDPOINT;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'NoEncryption': 'true'

    })
  };

  get(req: any) {
    const url = this.baseUrl + req.url;
    return this.http.get(url, this.httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        if (err.status === 500 && err.error && err.error.auth === false) {
          console.log(err);
        }
        return throwError(err);
      })
    );
  }

  getById(req: any) {
    const url = this.baseUrl + req.url;
    const params = new HttpParams().set('id', req.params.id).set('userId', req.params.userId);
    return this.http.get(url, { headers: this.httpOptions.headers, params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        if (err.status === 500 && err.error && err.error.auth === false) {
          console.log(err);
        }
        return throwError(err);
      })
    );
  }

  post(req: any) {
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