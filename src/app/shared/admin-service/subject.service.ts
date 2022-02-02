import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SubjectService {
    public apiCallStatusWise = new BehaviorSubject<{ statusId: number } | null>(null);
    public apiCallStatusWise$ = this.apiCallStatusWise.asObservable();
  
    public setApiCallStatusWise(response: { statusId: number } | null): void {
        this.apiCallStatusWise.next(response);
    }
}
