import { Component, OnInit } from '@angular/core';
import { AccountStoreService } from './account/account.store-service';

@Component({
  selector: 'lf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private accountStoreService: AccountStoreService) { }

  ngOnInit(): void {
    //login with any available auth token, if server confirms it is still valid.
    this.accountStoreService.loginAuthToken();
  }
}
