import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IDashboardState } from "../store/dashboard.reducer";

export const selectState = createFeatureSelector<IDashboardState>('dashboard');

export const dashboardAnalytics = createSelector(
  selectState,
  (dashboardState: IDashboardState) => dashboardState?.dashboardAnalytics
);
export const dashboardAnalyticsInProcess = createSelector(
  selectState,
  (dashboardState: IDashboardState) => dashboardState?.dashboardAnalyticsInProcess
);
export const dashboardAnalyticsSuccess = createSelector(
  selectState,
  (dashboardState: IDashboardState) => dashboardState?.dashboardAnalyticsSuccess
);