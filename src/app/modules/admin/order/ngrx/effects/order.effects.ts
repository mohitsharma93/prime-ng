import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as actions from '../actions/order.actions';
import { errorResolver } from 'src/app/shared/utils';
import { AdminOrderService } from 'src/app/modules/admin-service/dashboard/order.service';

@Injectable()
export class OrderEffects {

  constructor(
    private actions$: Actions,
    private orderService: AdminOrderService
  ) { }

  getOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getOrderAction),
      switchMap((req) => {
        return this.orderService.getOrdersService(req.request.endPoint, req.request.orderStatusId, req.request.urlMiddlePoint).pipe(
          map((res: any) => {
            if (res.Status !== 'OK') {
              return actions.getOrderActionError({ errors: errorResolver(res.ErrorMessage) });
            }
            return actions.getOrderActionComplete({ response: res });
          }),
          catchError((err) => {
            return of(actions.getOrderActionError({ errors: errorResolver(err.errors) }));
          })
        );
      })
    )
  );

  getOrderDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getOrderDetailAction),
      switchMap((req) => {
        return this.orderService.getOrderDetailService(req.request).pipe(
          map((res: any) => {
            if (res.Status !== 'OK') {
              return actions.getOrderDetailActionError({ errors: errorResolver(res.ErrorMessage) });
            }
            return actions.getOrderDetailActionComplete({ response: res });
          }),
          catchError((err) => {
            return of(actions.getOrderDetailActionError({ errors: errorResolver(err.errors) }));
          })
        );
      })
    )
  );
}
