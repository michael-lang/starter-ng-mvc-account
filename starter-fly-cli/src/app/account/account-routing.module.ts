import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { MemberLoginComponent } from './member-login/member-login.component';
import { MemberRegisterComponent } from './member-register/member-register.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [{
    path: 'account',
    component: AccountLayoutComponent,
    children: [
        {
            path: '',
            pathMatch: 'full',
            component: AccountDashboardComponent,
            data: {id: 'account-dashboard', title: 'Account Dashboard' },
            canActivate: [AuthGuard]
        },
        {
            path: 'login',
            component: MemberLoginComponent,
            data: {id: 'account-login', title: 'Login' },
        },
        {
            path: 'register',
            component: MemberRegisterComponent,
            data: {id: 'account-register', title: 'Register' },
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
