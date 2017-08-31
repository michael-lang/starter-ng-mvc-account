import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AsyncPipeBase } from '../../shared/utility/async-pipe-base';
import { AccountStoreService } from '../account.store-service';
import { AllowedActionsService } from './allowed-actions.service';

@Pipe({
    name: 'allowedAction',
    pure: false
})
export class AllowedActionPipe extends AsyncPipeBase<boolean> implements PipeTransform {
    constructor(ref: ChangeDetectorRef,
        private accountStore: AccountStoreService,
        private actionService: AllowedActionsService,
        private router: Router) {
        super(ref);
    }

    protected transformAsync(allowedAction: string, routeId: string): Observable<boolean> {
        return this.accountStore.account$
            .map((user) => {
                const access = this.actionService.roleMap[routeId];
                if (access === undefined || access === true) {
                    return true; //implicit allow for all
                }
                if (access === false) {
                    return false; //route is currently disabled
                }
                if (!user) {
                    return false; //not logged in, and no uniform access for all
                }
                const roleAccess = access[user.role];
                if (roleAccess === undefined || roleAccess === false) {
                    return false; //this role is implicitely excluded or explicitly denied
                }
                if (roleAccess === true) {
                    return true; //role given access to all actions
                }
                const actionAccess = roleAccess[allowedAction];
                if (actionAccess === undefined) {
                    return false; //this role is implicitely excluded / denied
                }
                return actionAccess; //explicitly denied or granted this action
            });
    }
}
