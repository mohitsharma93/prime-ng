import { Action, createReducer, on } from "@ngrx/store";
import * as actions from '../actions/root.actions';


export interface IRootState {
  user: any;
  
  orderStatusId: number | null;

  topBarSearchString: string | null;
};

export const initialState: IRootState = {
  user: null,
  
  orderStatusId: null,

  topBarSearchString: null,
}

export function rootReducer(state: IRootState | undefined, action: Action) {
  return _rootReducer(state, action)
}

const _rootReducer  = createReducer(
  initialState,
  on(actions.setGetOrderStatusId, (state, { response }) => {
    return {
      ...state,
      orderStatusId: response,
    };
  }),

  on(actions.topBarSearchString, (state, { response }) => {
    return {
      ...state,
      topBarSearchString: response,
    };
  }),
)