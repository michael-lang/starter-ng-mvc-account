import { Injectable } from '@angular/core';
import { LoginModel, AccountSummary, RegisterModel, AuthResponse, AuthTokenModel } from './account.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AccountService {
  private baseUrl: string;

  constructor(private _http: HttpClient) {
    this.baseUrl = environment.server + environment.apiUrl + 'account';
  }

  public login(data: LoginModel): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(this.baseUrl + '/login', data);
  }
  public register(data: RegisterModel): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(this.baseUrl + '/register', data);
  }
  public verifyAuthSessionToken(acct: AccountSummary): Observable<AuthResponse> {
	  var model = new AuthTokenModel();
	  model.authSessionToken = acct.authSessionToken;
    return this._http.post<AuthResponse>(this.baseUrl + '/verify', model);
  }
  public logout(acct: AccountSummary): any {
	  var model = new AuthTokenModel();
	  model.authSessionToken = acct.authSessionToken;
    return this._http.post<AuthResponse>(this.baseUrl + '/logout', model);
  }
}
