import { createAction, props } from "@ngrx/store";

export const setGetOrderStatusId = createAction(
  '[Dashboard] Get Order By Status',
  props<{ response: number | null }>()
);

export const topBarSearchString = createAction(
  '[Order] Top Bar Search String',
  props<{ response: string }>()
)