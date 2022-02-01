import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/order.actions';

export interface IOrderState {
  errors: string[];

  orders: any;
  ordersInProcess: boolean;
  ordersSuccess: boolean;

  orderDetail: any;
  orderDetailInProcess: boolean;
  orderDetailSuccess: boolean;

}

export const initialState: IOrderState = {
  errors: [],

  orders: null,
  ordersInProcess: false,
  ordersSuccess: false,

  orderDetail: null,
  orderDetailInProcess: false,
  orderDetailSuccess: false
};

export function orderReducer(state: IOrderState, action: Action) {
  return _orderReducer(state, action);
}

const _orderReducer = createReducer(
  initialState,
  on(actions.getOrderAction, (state) => {
    return {
      ...state,
      orders: null,
      ordersInProcess: true,
      ordersSuccess: false,
      errors: [],
    };
  }),
  on(actions.getOrderActionComplete, (state, { response }) => {
    return {
      ...state,
      orders: response?.Data,
      ordersInProcess: false,
      ordersSuccess: true,
      errors: [],
    };
  }),
  on(actions.getOrderActionError, (state, { errors }) => {
    return {
      ...state,
      ordersInProcess: false,
      ordersSuccess: false,
      errors: errors,
    };
  }),

  on(actions.getOrderDetailAction, (state) => {
    return {
      ...state,
      orderDetail: null,
      orderDetailInProcess: true,
      orderDetailSuccess: false,
      errors: [],
    };
  }),
  on(actions.getOrderDetailActionComplete, (state, { response }) => {
    return {
      ...state,
      orderDetail: response.Data,
      orderDetailInProcess: false,
      orderDetailSuccess: true,
      errors: [],
    };
  }),
  on(actions.getOrderDetailActionError, (state, { errors }) => {
    return {
      ...state,
      orderDetailInProcess: false,
      orderDetailSuccess: false,
      errors: errors,
    };
  }),
);
