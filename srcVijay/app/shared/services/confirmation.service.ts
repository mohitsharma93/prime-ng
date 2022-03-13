import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private subject = new Subject<any>();

  constructor() { }

  confirmation(data: any) {
    this.subject.next(data);
  }

  getConfirmation(): Observable<any> {
    return this.subject.asObservable();
  }
}
