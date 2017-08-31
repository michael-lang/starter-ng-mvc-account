import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountStoreService } from '../account.store-service';
import { AccountSummary } from '../account.model';

@Component({
  selector: 'lf-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss']
})
export class AccountDashboardComponent {
  model$: Observable<AccountSummary>;

  constructor(private accountService: AccountStoreService) {
    this.model$ = accountService.account$;
  }
}
