import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {
  baseUrl: string;
  constructor(private http: HttpClient, private toasterService: ToasterService) {
    this.baseUrl = environment.API_ENDPOINT;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };


 public loginUser(req: any) {
  const url = this.baseUrl + req.url;
  return this.http.post(url, req.params, this.httpOptions).pipe(
    map((response: any) => response),
    catchError((err) => {
      if (err.error && err.error.error && err.error.error == 'Wrong Crendtials') {
        this.toasterService.error(err.error.error_description);
      } else {
        this.toasterService.error('User Not Found Contact Customer Support');
      }
      return err;
    })
  );
}

}
