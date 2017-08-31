import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { accountReducer } from './account.store';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { MemberLoginComponent } from './member-login/member-login.component';
import { MemberRegisterComponent } from './member-register/member-register.component';
import { AccountService } from './account.service';
import { AccountMockService } from './account-mock.service';
import { AccountStoreService } from './account.store-service';
import { SharedModule } from '../shared/shared.module';
import { SharedImportsModule } from '../shared/imports/shared-imports.module';
import { AuthGuard } from './auth/auth.guard';
import { Router } from '@angular/router';
import { AllowedActionPipe } from './auth/allowed-action.pipe';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    SharedModule,
    SharedImportsModule,
    StoreModule.forFeature('account', accountReducer)
  ],
  declarations: [
    AccountLayoutComponent,
    AccountDashboardComponent,
    MemberLoginComponent,
    MemberRegisterComponent,
    AllowedActionPipe,
  ],
  exports: [
    AllowedActionPipe
  ],
  providers: [
    {
      provide: AccountService,
      useClass: environment.production ? AccountService : AccountMockService
    },
    AccountStoreService,
    AuthGuard
  ]
})
export class AccountModule { }
