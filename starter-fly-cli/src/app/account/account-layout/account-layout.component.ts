import { Component, OnInit } from '@angular/core';
import { AccountStoreService } from '../account.store-service';
import { Observable } from 'rxjs/Observable';
import { AccountSummary } from '../account.model';

@Component({
  selector: 'lf-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.scss']
})
export class AccountLayoutComponent implements OnInit {
  user: Observable<AccountSummary>;

  constructor(private accountStore: AccountStoreService) {
    this.user = accountStore.account$;
  }

  ngOnInit() {
  }

}
