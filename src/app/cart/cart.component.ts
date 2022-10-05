import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../cart.service";
import {ICart} from "../_interfaces/ICart";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnDestroy {

  cart: ICart | null = null;
  errorMessage: string | null = null;

  onDestroy = new Subject();

  constructor(private cartService: CartService) {
    this.cartService.$cart
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (cart) => {
          this.cart = cart
        }
      );

    this.cartService.$cartLoadingError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        message => this.errorMessage = message
      )
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onViewProductsClick() {
    this.cartService.$isViewingCart.next(false);
  }

}
