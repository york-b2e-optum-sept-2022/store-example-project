import {Component, OnDestroy, OnInit} from '@angular/core';
import {IAccount} from "../_interfaces/IAccount";
import {Subject, takeUntil} from "rxjs";
import {AccountService} from "../account.service";
import {CartService} from "../cart.service";
import {ProductsService} from "../products.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnDestroy {
  searchText = "";
  account: IAccount | null = null;
  cartCount: number | null = null;
  isViewingCart: boolean = false;

  onDestroy = new Subject();

  constructor(
    private cartService: CartService,
    private accountService: AccountService,
    private productService: ProductsService
  ) {
    this.accountService.$account
      .pipe(takeUntil(this.onDestroy))
      .subscribe(account => {
        this.account = account
      })
    this.cartService.$cart
      .pipe(takeUntil(this.onDestroy))
      .subscribe(cart => {
        this.cartCount = cart?.productList?.length ?? null
      });
    this.cartService.$isViewingCart
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isViewingCart => {
        this.isViewingCart = isViewingCart
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onCartClick() {
    this.cartService.$isViewingCart.next(!this.isViewingCart)
  }

  onLogoutClick() {
    this.accountService.logout();
  }

  onSearchTextChange(text: string) {
    this.productService.onSearchTextChange(text);
  }

}
