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
import { RegisterModel } from '../account.model';

@Component({
  selector: 'lf-member-register',
  templateUrl: './member-register.component.html',
  styleUrls: ['./member-register.component.scss']
})
export class MemberRegisterComponent implements OnInit, AfterViewInit {
  @Observe.OnDestroy() onDestroy$: Observable<void>;
  registerForm: FormGroup;
  model$: Observable<RegisterModel>;
  modelLocal: RegisterModel = new RegisterModel();
  status$: Observable<string>;
  message$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountStoreService
  ) {
    this.model$ = accountService.registerData$;
    this.status$ = accountService.actionStatus$;
    this.message$ = accountService.actionMessage$;
    this.createForm();
    this.modelLocal.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

    createForm() {
      this.registerForm = this.fb.group({
        userName: ['', Validators.required],
        emailAddress: ['', Validators.email],
        phoneNumber: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dob: [new Date(new Date().getFullYear() - 14, 1), Validators.required],
        password: ['', Validators.required]
      });
    }
    ngOnInit() {
      this.model$
        .take(2) //set form initial value (first is null, second is after first user edit debounce)
        .subscribe(x => {
          this.modelLocal = x || new RegisterModel();
          this.modelLocal.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.registerForm.patchValue(this.modelLocal, {onlySelf: true, emitEvent: true});
        });
    }

    ngAfterViewInit() {
      Observable.combineLatest(
        this.registerForm.statusChanges,
        this.registerForm.valueChanges,
        (status, value) => ({status, value})
      )
      .debounceTime(200)
      .takeUntil(this.onDestroy$)
      .subscribe(({value}) => {
        if (value) {
          this.modelLocal = {...this.modelLocal,
            userName: value.userName,
            emailAddress: value.emailAddress,
            phoneNumber: value.phoneNumber,
            firstName: value.firstName,
            lastName: value.lastName,
            dob: value.dob,
            password: value.password
          };
          this.accountService.registerChange(this.modelLocal);
        }
      });
    }

    register(data: RegisterModel) {
      this.accountService.logout();
      this.modelLocal = {...this.modelLocal,
        userName: data.userName,
        emailAddress: data.emailAddress,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        password: data.password
      };
      if (this.registerForm.valid) {
        this.accountService.register(this.modelLocal);
      }
    }

}
