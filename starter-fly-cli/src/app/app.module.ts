import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { environment } from '../environments/environment';
import { MdNativeDateModule } from '@angular/material';

import { appReducers, appMetaReducers } from './app.store';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './account/account.module';
import { ALLOWED_ACTIONS_ROLE_MAP, AllowedActionsService } from './account/auth/allowed-actions.service';
import { ROUTE_ACTIONS_TO_ROLE_MAP } from './app-actions-role-map';
import { AccountStoreService } from './account/account.store-service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    MdNativeDateModule,
    AccountModule,
    RouterModule.forRoot([
      {
        path: '',
        component: AppComponent,
        children: [
          {
            path: '', redirectTo: 'account', pathMatch: 'full'
          },
          {
            path: 'account',
            loadChildren: 'app/account/account.module#AccountModule'
          }
        ]
      },
    ]),
    //ngrx/store setup
    StoreModule.forRoot(appReducers, {metaReducers: appMetaReducers}),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument( { maxAge: 50 }) : []
  ],
  providers: [
    {
      provide: ALLOWED_ACTIONS_ROLE_MAP,
      useValue: ROUTE_ACTIONS_TO_ROLE_MAP
    },
    AllowedActionsService,
    AccountStoreService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
