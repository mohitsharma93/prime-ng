import { finalize, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpWrapperService {
  constructor(
    private _http: HttpClient,
  ) { }

  public get = (url: string, params?: any, options?: any): Observable<any> => {
    options = { ...options };
    options = this.prepareOptions(options);
    options.params = params;
    return this._http.get(url, options).pipe(
      tap((res) => { }),
      finalize(() => { })
    );
  };

  public post = (url: string, body: any, options?: any, addContentType: boolean = true): Observable<any> => {
    options = { ...options };
    options = this.prepareOptions(options, addContentType);
    return this._http.post(url, body, options).pipe(
      tap((res) => {
        //
      }),
      finalize(() => { })
    );
  };
  public put = (url: string, body: any, options?: any): Observable<any> => {
    options = { ...options };
    options = this.prepareOptions(options);
    return this._http.put(url, body, options).pipe(
      tap((res) => {
        //
      }),
      finalize(() => { })
    );
  };
  public delete = (url: string, params?: any, options?: any): Observable<any> => {
    options = { ...options };
    options = this.prepareOptions(options);
    options.search = this.objectToParams(params);
    return this._http.delete(url, options).pipe(
      tap((res) => {
        //
      }),
      finalize(() => { })
    );
  };
  public patch = (url: string, body: any, options?: any): Observable<any> => {
    options = { ...options };
    options = this.prepareOptions(options);
    return this._http.patch(url, body, options).pipe(
      tap((res) => {
        //
      }),
      finalize(() => { })
    );
  };

  public prepareOptions(options: any, addContentType: boolean = true): any {
    options = options || {};

    if (!options.headers) {
      options.headers = {} as any;
    }

    if ((!options.headers['Content-Type']) && addContentType) {
      options.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    if (options.headers['Content-Type'] === 'multipart/form-data') {
      delete options.headers['Content-Type'];
    }

    options.headers = new HttpHeaders(options.headers);
    return options;
  }

  public isPrimitive(value: any) {
    return value == null || (typeof value !== 'function' && typeof value !== 'object');
  }

  public objectToParams(object: any = {}) {
    return Object.keys(object)
      .map((value) => {
        const objectValue = this.isPrimitive(object[value]) ? object[value] : JSON.stringify(object[value]);
        return `${value}=${objectValue}`;
      })
      .join('&');
  }
}
