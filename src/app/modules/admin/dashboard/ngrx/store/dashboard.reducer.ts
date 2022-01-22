import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/dashboard.actions';

export interface IDashboardState {
  errors: string[];

  dashboardAnalytics: any;
  dashboardAnalyticsInProcess: boolean;
  dashboardAnalyticsSuccess: boolean;

}

export const initialState: IDashboardState = {
  errors: [],

  dashboardAnalytics: null,
  dashboardAnalyticsInProcess: false,
  dashboardAnalyticsSuccess: false
};

export function dashboardReducer(state: IDashboardState | undefined, action: Action) {
  return _dashboardReducer(state, action);
}

const _dashboardReducer = createReducer(
  initialState,
  on(actions.getDashboardAnalyticTypeAction, (state) => {
    return {
      ...state,
      dashboardAnalytics: null,
      dashboardAnalyticsInProcess: true,
      dashboardAnalyticsSuccess: false,
      errors: [],
    };
  }),
  on(actions.getDashboardAnalyticTypeActionComplete, (state, { response }) => {
    return {
      ...state,
      dashboardAnalytics: response.data,
      dashboardAnalyticsInProcess: false,
      dashboardAnalyticsSuccess: true,
      errors: [],
    };
  }),
  on(actions.getDashboardAnalyticTypeActionError, (state, { errors }) => {
    return {
      ...state,
      dashboardAnalyticsInProcess: false,
      dashboardAnalyticsSuccess: false,
      errors: errors,
    };
  }),
);
