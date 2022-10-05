import {Component, OnDestroy} from '@angular/core';
import {AccountService} from "./account.service";
import {Observable, Subject, Subscription, takeUntil} from "rxjs";
import {CartService} from "./cart.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  isLoggedIn: boolean = false;
  isRegistering: boolean = false;
  isViewingCart: boolean = false;

  onDestroy = new Subject();

  constructor(
    private cartService: CartService,
    private accountService: AccountService,
  ) {
    this.accountService.$account
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.isLoggedIn = account ? true : false;
      });
    this.accountService.$isRegistering
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isRegistering => {
        this.isRegistering = isRegistering;
      });
    this.cartService.$isViewingCart
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isViewingCart => {
        this.isViewingCart = isViewingCart
      })
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
