import { ofType } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
// import { generalActions } from '../actions';
import * as rootReducer from './reducer/root.reducer';

export interface IAppState {
    root: rootReducer.IRootState;
}

export const reducers: ActionReducerMap<IAppState> = {
    root: rootReducer.rootReducer,
};

export function localStorageSyncReducer(r: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({
        keys: [{ auth: ['user'] }],
        rehydrate: true,
        storage: localStorage,
    })(r);
}
export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state: any, action: any): any {
        if (action.type === '[Logout] User') {
            state = undefined;
        }
        return reducer(state, action);
    };
}
export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, clearState];
