import { createAction, props } from '@ngrx/store';
import { IOrderRequestModel } from 'src/app/models/admin/order';


export const getOrderAction = createAction(
  '[Dashboard] Get Order Type',
  props<{ request: IOrderRequestModel }>()
);
export const getOrderActionComplete = createAction(
  '[Dashboard] Get Order Type Complete',
  props<{ response: any }>()
);
export const getOrderActionError = createAction(
  '[Dashboard] Get Order Type Error',
  props<{ errors: string[] }>()
);

export const getOrderDetailAction = createAction(
  '[Dashboard] Get Order Detail Type',
  props<{ request: any }>()
);
export const getOrderDetailActionComplete = createAction(
  '[Dashboard] Get Order Detail Type Complete',
  props<{ response: any }>()
);
export const getOrderDetailActionError = createAction(
  '[Dashboard] Get Order Detail Type Error',
  props<{ errors: string[] }>()
);