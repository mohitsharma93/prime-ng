import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as actions from '../actions/dashboard.actions';
import { AdminDashboardService } from 'src/app/modules/admin-service/dashboard/dashboard.service';
import { errorResolver } from 'src/app/shared/utils';

@Injectable()
export class DashboardEffects {

  constructor(
    private actions$: Actions,
    private dashboardService: AdminDashboardService
  ) { }

  getDashboardAnalytic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getDashboardAnalyticTypeAction),
      switchMap((req) => {
        return this.dashboardService.getDashboardAnalyticsService(req.request).pipe(
          map((res: any) => {
              if (res.Status !== 'OK') {
                  return actions.getDashboardAnalyticTypeActionError({ errors: errorResolver(res.ErrorMessage) });
              }
              return actions.getDashboardAnalyticTypeActionComplete({ response: res });
          }),
          catchError((err) => {
              return of(actions.getDashboardAnalyticTypeActionError({ errors: errorResolver(err.errors) }));
          })
      );
      })
    )
  );
}
