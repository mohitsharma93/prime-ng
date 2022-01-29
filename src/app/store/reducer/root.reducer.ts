import { Action, createReducer, on } from "@ngrx/store"


export interface IRootState {
  user: any;
};

export const initialState: IRootState = {
  user: null
}

export function rootReducer(state: IRootState | undefined, action: Action) {
  return _rootReducer(state, action)
}

const _rootReducer  = createReducer(
  initialState
)