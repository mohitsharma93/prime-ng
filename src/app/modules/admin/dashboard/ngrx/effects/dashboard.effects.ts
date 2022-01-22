import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as actions from '../actions/dashboard.actions';

@Injectable()
export class DashboardEffects {

  constructor(
    private actions$: Actions
  ) { }

  getDashboardAnalytic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getDashboardAnalyticTypeAction),
      switchMap(() => {
        return [actions.getDashboardAnalyticTypeActionComplete({ response: {} })]
      })
    )
  );
}
