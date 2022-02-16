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

    public orderDetailShipment = new BehaviorSubject<any>(null);
    public orderDetailShipment$ = this.orderDetailShipment.asObservable();

    public saveFilterOnRedirection = new BehaviorSubject<any>(null);
    public saveFilterOnRedirection$ = this.saveFilterOnRedirection.asObservable();

    public holdIdsForCreateShipment = new BehaviorSubject<any>(null);
    public holdIdsForCreateShipment$ = this.holdIdsForCreateShipment.asObservable();

    public holdBulkDataForNext = new BehaviorSubject<any>(null);
    public holdBulkDataForNext$ = this.holdBulkDataForNext.asObservable();

    public setApiCallStatusWise(response: { statusId: number } | null): void {
        this.apiCallStatusWise.next(response);
    }

    public setSearchStringFromTobBar(response: string| null): void {
        this.searchStringFromTobBar.next(response);
    }

    public setOrderDetail(response: any): void {
        this.orderDetail.next(response);
    }

    public setOrderDetailShipment(response: any): void {
        this.orderDetailShipment.next(response);
    }

    public setSaveFilterOnRedirection(response: any): void {
        this.saveFilterOnRedirection.next(response);
    }

    public setHoldIdsForCreateShipment(response: any): void {
        this.holdIdsForCreateShipment.next(response);
    }

    public setHoldBulkDataForNext(response: any): void {
        this.holdBulkDataForNext.next(response);
    }
}
