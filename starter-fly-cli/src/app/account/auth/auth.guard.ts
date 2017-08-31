import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountSummary } from '../account.model';
import { AccountStoreService } from '../account.store-service';
import { AllowedActionsService } from './allowed-actions.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private actionService: AllowedActionsService,
        private accountStore: AccountStoreService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.accountStore.account.map( (user) => {
            if (!(user && user.authSessionToken)) {
                //not logged in...
                this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
                return false;
            }

            const routeId = route.data && route.data['id'];
            if (!routeId) { throw new Error(`'Unable to determine route id for route guard: ${route}`); }
            const access = this.actionService.roleMap[routeId];
            if (!access) { throw new Error(`'Unable to determine access for route guard: ${route}`); }
            if (access === true || access === false) {
                return access; //implicitly granted or denied for all
            }

            const roleAccess = access[user.role];
            return (roleAccess === undefined || roleAccess === false) ? false : true;
        });
    }
}
