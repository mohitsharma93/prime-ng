import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IOrderState } from "../store/order.reducer";

export const selectState = createFeatureSelector<IOrderState>('order');

export const orders = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.orders
);
export const ordersInProcess = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.ordersInProcess
);
export const ordersSuccess = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.ordersSuccess
);

export const orderDetail = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.orderDetail
);
export const orderDetailInProcess = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.orderDetailInProcess
);
export const orderDetailSuccess = createSelector(
  selectState,
  (dashboardState: IOrderState) => dashboardState?.orderDetailSuccess
);