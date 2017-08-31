import { Injectable } from '@angular/core';
import { LoginModel, AccountSummary, RegisterModel, AuthResponse } from './account.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AccountService } from './account.service';
import 'rxjs/add/observable/of';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/* A mock / test implementation of the AccountService for testing purposes.
 * These function implementations do not represent best practices for server
 * side authentication/authorization logic nor password storage.
*/
@Injectable()
export class AccountMockService extends AccountService {
    //variables to hold mock data.  these passwords are exposed since they are fake test data.
    //  on a real back-end, passwords would not be stored in plain text, nor in the localStorage at all.
    private _users: AccountSummary[] = new Array<AccountSummary>();
    private _passwords: LoginModel[] = new Array<LoginModel>();
    private _lastUserId = 1000;
    private _lastAuthToken = 100100100;

    constructor(private http: HttpClient) {
        super(http);
        console.warn('Warning: You are using the AccountMockService, not intended for production use.');

        //load cached test/mock data from store
        const storeUsers = localStorage.getItem('_users');
        if (storeUsers) {
            this._users = JSON.parse(storeUsers);
        }
        const storePasswords = localStorage.getItem('_passwords');
        if (storePasswords) {
            this._passwords = JSON.parse(storePasswords);
        }
        const storeLastUserId = localStorage.getItem('_lastUserId');
        if (storeUsers) {
            this._lastUserId = JSON.parse(storeLastUserId);
        }
        const storeLastAuthToken = localStorage.getItem('_lastAuthToken');
        if (storeUsers) {
            this._lastAuthToken = JSON.parse(storeLastAuthToken);
        }
    }

    public login(data: LoginModel): Observable<AuthResponse> {
        const user = this._passwords.filter(x => x.identifier === data.identifier
            && x.password === data.password); //password check so we can verify wrong password error message.
        const account = !user || user.length === 0 ? null
            : this._users.filter(y => y.userName === user[0].identifier);
        const auth = new AuthResponse();
        if (!account || account.length === 0) {
            auth.account = null;
            auth.message = 'Invalid name or password';
            auth.status = '401';
        } else {
            auth.account = account[0];
            auth.account.authSessionToken = (++this._lastAuthToken) + '';
            auth.message = '';
            auth.status = '';
            localStorage.setItem('_lastAuthToken', JSON.stringify(this._lastAuthToken));
            localStorage.setItem('_users', JSON.stringify(this._users));
        }

        return Observable.of(auth);
    }
    public register(data: RegisterModel): Observable<AuthResponse> {
        const existUser = this._passwords.filter(x => x.identifier === data.userName);
        if (existUser && existUser.length > 0) {
            const auth = new AuthResponse();
            auth.account = null;
            auth.message = 'Username already exists.  Choose another.';
            auth.status = '403';
            return Observable.of(auth);
        }

        const account = new AccountSummary();
        account.id = (this._lastUserId++) + '';
        account.userName = data.userName;
        account.firstName = data.firstName;
        account.lastName = data.lastName;
        account.emailAddress = data.emailAddress;
        account.phoneNumber = data.phoneNumber;
        account.dob = data.dob;
        account.role = 'member';
        account.authSessionToken = (++this._lastAuthToken) + '';
        const pw = new LoginModel();
        pw.identifier = account.userName;
        pw.password = data.password;
        this._passwords.push(pw);
        const auth = new AuthResponse();
        auth.account = account;
        auth.message = '';
        auth.status = '';
        this._users.push(account);

        localStorage.setItem('_users', JSON.stringify(this._users));
        localStorage.setItem('_passwords', JSON.stringify(this._passwords));
        localStorage.setItem('_lastUserId', JSON.stringify(this._lastUserId));
        localStorage.setItem('_lastAuthToken', JSON.stringify(this._lastAuthToken));
        return Observable.of(auth);
    }

    public verifyAuthSessionToken(acct: AccountSummary): Observable<AuthResponse> {
        const account = this._users.filter(y => y.authSessionToken === acct.authSessionToken);
        const auth = new AuthResponse();
        if (!account || account.length === 0) {
            auth.account = null;
            auth.message = 'Invalid or expired auth token';
            auth.status = '401';
        } else {
            auth.account = account[0];
            auth.message = '';
            auth.status = '';
        }
        return Observable.of(auth);
    }

    public logout(acct: AccountSummary): any {
        //nothing to do in the mock, but the server implementation would invalidate the authSessionToken
        return null;
    }

}
