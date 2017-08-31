import { Observable } from 'rxjs/Observable';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import 'rxjs/add/operator/map';

export const ALLOWED_ACTIONS_ROLE_MAP = new InjectionToken<any>('ALLOWED_ACTIONS_ROLE_MAP');

@Injectable()
export class AllowedActionsService {
    public roleMap: any;
    constructor(@Inject(ALLOWED_ACTIONS_ROLE_MAP) _roleMap: any) {
        this.roleMap = _roleMap;
    }
}
