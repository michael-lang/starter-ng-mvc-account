import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';
import { Observe } from '../../shared/utility/observe_decorators';

import { AccountStoreService } from '../account.store-service';
import { LoginModel } from '../account.model';

@Component({
  selector: 'lf-member-login',
  templateUrl: './member-login.component.html',
  styleUrls: ['./member-login.component.scss']
})
export class MemberLoginComponent implements OnInit, AfterViewInit {
  @Observe.OnDestroy() onDestroy$: Observable<void>;
  loginForm: FormGroup;
  model$: Observable<LoginModel>;
  modelLocal: LoginModel = new LoginModel();
  status$: Observable<string>;
  message$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountStoreService
  ) {
    this.model$ = accountService.loginData$;
    this.status$ = accountService.actionStatus$;
    this.message$ = accountService.actionMessage$;
    this.createForm();
    this.modelLocal.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm() {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.model$
      .take(2) //set form initial value (first is null, second is after first user edit debounce)
      .subscribe(x => {
        this.modelLocal = x || new LoginModel();
        this.modelLocal.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.loginForm.patchValue(this.modelLocal, {onlySelf: true, emitEvent: true});
      });
  }

  ngAfterViewInit() {
    Observable.combineLatest(
      this.loginForm.statusChanges,
      this.loginForm.valueChanges,
      (status, value) => ({status, value})
    )
    .debounceTime(200)
    .takeUntil(this.onDestroy$)
    .subscribe(({value}) => {
      if (value) {
        this.modelLocal = {...this.modelLocal, identifier: value.identifier, password: value.password};
        this.accountService.loginChange(this.modelLocal);
      }
    });
  }

  login(data: LoginModel) {
    this.accountService.logout();
    this.modelLocal = {...this.modelLocal, identifier: data.identifier, password: data.password};
    if (this.loginForm.valid) {
      this.accountService.login(this.modelLocal);
    }
  }
}
