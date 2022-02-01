import { createAction, props } from "@ngrx/store";

export const setGetOrderStatusId = createAction(
  '[Dashboard] Get Order By Status',
  props<{ response: number | null }>()
);