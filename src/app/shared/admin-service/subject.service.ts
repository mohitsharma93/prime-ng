import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SubjectService {
    public apiCallStatusWise = new BehaviorSubject<{ statusId: number } | null>(null);
    public apiCallStatusWise$ = this.apiCallStatusWise.asObservable();

    public searchStringFromTobBar = new BehaviorSubject<string | null>(null);
    public searchStringFromTobBar$ = this.searchStringFromTobBar.asObservable();

    public orderDetail = new BehaviorSubject<any>(null);
    public orderDetail$ = this.orderDetail.asObservable();
  
    public setApiCallStatusWise(response: { statusId: number } | null): void {
        this.apiCallStatusWise.next(response);
    }

    public setSearchStringFromTobBar(response: string| null): void {
        this.searchStringFromTobBar.next(response);
    }

    public setOrderDetail(response: any): void {
        this.orderDetail.next(response);
    }
}
