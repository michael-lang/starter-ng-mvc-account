import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountSummary, RegisterModel, LoginModel, AuthResponse } from './account.model';
import { AccountService } from './account.service';

import {
    AccountActionStatus, AccountAppState,
    AccountLoginChangeAction, AccountLoginCompleteAction,
    AccountRegisterChangeAction, AccountRegisterCompleteAction,
    AccountLogoutCompleteAction
} from './account.store';

@Injectable()
export class AccountStoreService {
    registerData$: Observable<RegisterModel>;
    loginData$: Observable<LoginModel>;
    actionStatus$: Observable<AccountActionStatus>;
    actionMessage$: Observable<string>;
    account$: Observable<AccountSummary>;

    constructor(
        private _accountService: AccountService,
        private router: Router,
        private _store: Store<AccountAppState>
    ) {
        this.registerData$ = _store.select((s: AccountAppState) => s.account.registerData);
        this.loginData$ = _store.select((s: AccountAppState) => s.account.loginData);
        this.actionStatus$ = _store.select((s: AccountAppState) => s.account.actionStatus);
        this.actionMessage$ = _store.select((s: AccountAppState) => s.account.actionMessage);
        this.account$ = _store.select((s: AccountAppState) => s.account.account);
    }

    get registerData(): Observable<RegisterModel> {
        return this.registerData$;
    }
    get loginData(): Observable<LoginModel> {
        return this.loginData$;
    }
    get actionStatus(): Observable<AccountActionStatus> {
        return this.actionStatus$;
    }
    get actionMessage(): Observable<string> {
        return this.actionMessage$;
    }
    get account(): Observable<AccountSummary> {
        return this.account$;
    }

    public loginChange(data: LoginModel) {
        this._store.dispatch(new AccountLoginChangeAction(data));
    }
    public login(data: LoginModel) {
        this._store.dispatch(new AccountLoginChangeAction(data));
        this._accountService.login(data)
            .subscribe(
            (authResp: AuthResponse) => {
                this._store.dispatch(new AccountLoginCompleteAction(authResp.account, authResp.message));
                localStorage.setItem('currentAccount', JSON.stringify(authResp.account));
                this.router.navigate([data.returnUrl || '/']);
            },
            (error) => { this._store.dispatch(new AccountLoginCompleteAction(null, 'API Error: ' + error)); }
            );
    }
    public loginAuthToken() {
        const currentAccountStr = localStorage.getItem('currentAccount');
        if (!currentAccountStr) { return; }
        const currentAccount: AccountSummary = JSON.parse(currentAccountStr);

        //trigger setting user name from last session in case loading session fails
        const loginModel = new LoginModel();
        loginModel.identifier = currentAccount.userName;
        loginModel.password = '';
        this._store.dispatch(new AccountLoginChangeAction(loginModel));

        //attempt to load the last session, if authToken is still valid.
        this._accountService.verifyAuthSessionToken(currentAccount)
            .subscribe(
            (authResp: AuthResponse) => {
                this._store.dispatch(new AccountLoginCompleteAction(authResp.account, authResp.message));
                if (!authResp.account) {
                    localStorage.setItem('currentAccount', null);
                }
                this.router.navigate(['/']);
            },
            (error) => {
                this._store.dispatch(new AccountLoginCompleteAction(null, 'API Error: ' + error));
            });
    }
    public logout() {
        const currentAccountStr = localStorage.getItem('currentAccount');
        if (!currentAccountStr) { return; }
        const currentAccount: AccountSummary = JSON.parse(currentAccountStr);
        if (!currentAccount) { return; }
        this._store.dispatch(new AccountLogoutCompleteAction());
        localStorage.removeItem('currentAccount');
        this._accountService.logout(currentAccount);
    }
    public registerChange(data: RegisterModel) {
        this._store.dispatch(new AccountRegisterChangeAction(data));
    }
    public register(data: RegisterModel) {
        this._store.dispatch(new AccountRegisterChangeAction(data));
        this._accountService.register(data)
            .subscribe(
            (authResp: AuthResponse) => {
                this._store.dispatch(new AccountRegisterCompleteAction(authResp.account, authResp.message));
                localStorage.setItem('currentAccount', JSON.stringify(authResp.account));
                this.router.navigate([data.returnUrl || '/']);
            },
            (error) => { this._store.dispatch(new AccountRegisterCompleteAction(null, 'API Error: ' + error)); }
            );
    }
}
