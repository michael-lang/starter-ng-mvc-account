import { routerReducer, RouterReducerState } from '@ngrx/router-store';

export interface AppState {
    router: RouterReducerState;
}

export const appReducers = {
    router: routerReducer,
};

//TODO: storeFreeze is not compatible with ngrx 4
export const appMetaReducers = []; //environment.enableStoreFreeze ? [storeFreze] : [];
