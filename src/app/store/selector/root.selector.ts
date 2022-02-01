import { createSelector } from "@ngrx/store";
import { IAppState } from "../app.state";


export const selectState = (state: IAppState) => state;

export const rootState = createSelector(selectState, (p) => p.root);

export const currentUser = createSelector(rootState, (p) => p.user);

export const selectOrderStatusId = createSelector(rootState, (p) => p.orderStatusId);