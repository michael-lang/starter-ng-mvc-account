import { Action } from '@ngrx/store';
import { type, buildReducer } from '../shared/store/type-cache'; 
import { AppState } from '../app.store';
import { RegisterModel, LoginModel, AccountSummary } from './account.model';

export type AccountActionStatus = 'ready' | 'pending' | 'failure' | 'success';

export interface AccountState {
    registerData: RegisterModel;
    loginData: LoginModel;
    actionStatus: AccountActionStatus;
    actionMessage: string;
    account: AccountSummary;
}

export interface AccountAppState extends AppState {
    account: AccountState;
}

export const initialAccountState: AccountState = {
    registerData: null,
    loginData: null,
    actionStatus: 'ready',
    actionMessage: '',
    account: null
};

export class AccountRegisterChangeAction implements Action {
    static type: string = type('[Account] Register Change');
    type = AccountRegisterChangeAction.type;

    static reduce(state: AccountState, action: AccountRegisterChangeAction): AccountState {
        return {
            ...state,
            registerData: action.payload || null,
            actionStatus: 'ready',
            actionMessage: '',
        };
    }

    constructor(public payload: RegisterModel) { }
}

export class AccountRegisterCompleteAction implements Action {
    static type: string = type('[Account] Register Complete');
    type = AccountRegisterCompleteAction.type;

    static reduce(state: AccountState, action: AccountRegisterCompleteAction): AccountState {
        return {
            ...state,
            registerData: (action.errorMessage || '') === '' ? null : state.registerData,
            loginData: null,
            actionStatus: (action.errorMessage || '') === '' ? 'success' : 'failure',
            actionMessage: action.errorMessage || '',
            account: action.payload || null
        };
    }

    constructor(public payload: AccountSummary, public errorMessage: string) { }
}

export class AccountLoginChangeAction implements Action {
    static type: string = type('[Account] Login Change');
    type = AccountLoginChangeAction.type;

    static reduce(state: AccountState, action: AccountLoginChangeAction): AccountState {
        return {
            ...state,
            loginData: action.payload || null,
            actionStatus: 'ready',
            actionMessage: '',
        };
    }

    constructor(public payload: LoginModel) { }
}

export class AccountLoginCompleteAction implements Action {
    static type: string = type('[Account] Login Complete');
    type = AccountLoginCompleteAction.type;

    static reduce(state: AccountState, action: AccountLoginCompleteAction): AccountState {
        return {
            ...state,
            registerData: null,
            loginData: (action.errorMessage || '') === '' ? null : state.loginData,
            actionStatus: (action.errorMessage || '') === '' ? 'success' : 'failure',
            actionMessage: action.errorMessage || '',
            account: action.payload || null
        };
    }

    constructor(public payload: AccountSummary, public errorMessage: string) { }
}
export class AccountLogoutCompleteAction implements Action {
    static type: string = type('[Account] Logout Complete');
    type = AccountLogoutCompleteAction.type;

    static reduce(state: AccountState, action: AccountLogoutCompleteAction): AccountState {
        return {
            ...state,
            registerData: null,
            loginData: null,
            actionStatus: 'ready',
            actionMessage: '',
            account: null
        };
    }

    constructor() { }
}

const reducer = buildReducer(initialAccountState,
    AccountRegisterChangeAction,
    AccountRegisterCompleteAction,
    AccountLoginChangeAction,
    AccountLoginCompleteAction,
    AccountLogoutCompleteAction
);

export function accountReducer(state: AccountState, action: Action): AccountState {
    return reducer(state, action);
}

