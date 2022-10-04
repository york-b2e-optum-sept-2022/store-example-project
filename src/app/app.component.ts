import {Component, OnDestroy} from '@angular/core';
import {AccountService} from "./account.service";
import {Observable, Subject, Subscription, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  isLoggedIn: boolean = false;
  isRegistering: boolean = false;

  subscriptions: Subscription;

  constructor(private accountService: AccountService) {
    this.subscriptions = this.accountService.$account.subscribe(account => {
      this.isLoggedIn = account ? true : false;
    });
    this.subscriptions = this.accountService.$isRegistering.subscribe(isRegistering => {
      this.isRegistering = isRegistering;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
