import { createAction, props } from '@ngrx/store';


export const getDashboardAnalyticTypeAction = createAction(
  '[Dashboard] Get Dashboard Analytics',
  props<{ request: any }>()
);
export const getDashboardAnalyticTypeActionComplete = createAction(
  '[Dashboard] Get Dashboard Analytics Type Complete',
  props<{ response: any }>()
);
export const getDashboardAnalyticTypeActionError = createAction(
  '[Dashboard] Get Dashboard Analytics Type Error',
  props<{ errors: string[] }>()
);
