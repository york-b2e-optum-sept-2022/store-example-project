import {Injectable} from '@angular/core';
import {AccountService} from "./account.service";
import {BehaviorSubject, first} from "rxjs";
import {ICart} from "./_interfaces/ICart";
import {HttpService} from "./http.service";
import {IAccount} from "./_interfaces/IAccount";
import {IProduct} from "./_interfaces/IProduct";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  $cart = new BehaviorSubject<ICart | null>(null);
  $isViewingCart = new BehaviorSubject<boolean>(false);
  $cartLoadingError = new BehaviorSubject<string | null>(null);

  private readonly TAX_RATE = 0.07;
  private readonly SHIPPING_COST = 5;

  private readonly CART_LOADING_ERROR = "unable to load your cart, please try again later";
  private readonly CART_UPDATE_ERROR = "unable to update your cart, please try again later";
  private readonly CART_MISSING_ERROR = "Unable to locate your cart, please try to logout and back in";
  private readonly CART_ITEM_MISSING_ERROR = "unable to locate your product, please try to logout and back in";

  constructor(
    private httpService: HttpService,
    private accountService: AccountService,
  ) {
    this.accountService.$account.subscribe(
      (account) => {
        if (!account) {
          return;
        }

        this.httpService
          .getCartById(account.id)
          .pipe(first())
          .subscribe({
            next: (cart) => {
              if (!cart) {
                this.createCart(account);
                return;
              }

              this.$cart.next(cart);
            },
            error: (err) => {
              if (err.status === 404) {
                this.createCart(account);
                return;
              }

              console.error(err)
              this.$cartLoadingError.next(this.CART_LOADING_ERROR);
            },
          })
      }
    )
  }

  addProductToCart(product: IProduct) {
    const cart = this.$cart.getValue();
    if (!cart) {
      this.$cartLoadingError.next(this.CART_MISSING_ERROR);
      return;
    }

    const existingProduct = cart.productList.find(cartItem => cartItem.product.name === product.name);
    if (existingProduct) {
      existingProduct.count += 1;
    } else {
      cart.productList.push({count: 1, product});
    }

    this.updateCartTotals(cart);
    this.saveCart(cart);
  }

  updateCartCount(product: IProduct, newCount: number) {
    const cart = this.$cart.getValue();
    if (!cart) {
      this.$cartLoadingError.next(this.CART_MISSING_ERROR);
      return;
    }

    // do not allow number select to go under 1
    if (!newCount || newCount < 1) {
      newCount = 1;
    }

    const existingProduct = cart.productList.find(cartItem => cartItem.product.name === product.name);
    if (!existingProduct) {
      this.$cartLoadingError.next(this.CART_ITEM_MISSING_ERROR);
      return;
    }

    existingProduct.count = newCount;
    this.updateCartTotals(cart);
    this.saveCart(cart);
  }

  removeItemFromCart(product: IProduct) {
    const cart = this.$cart.getValue();
    if (!cart) {
      this.$cartLoadingError.next(this.CART_MISSING_ERROR);
      return;
    }

    const productIndex = cart.productList.findIndex(cartItem => cartItem.product.name === product.name);
    if (productIndex === -1) {
      this.$cartLoadingError.next(this.CART_ITEM_MISSING_ERROR);
      return;
    }

    cart.productList.splice(productIndex, 1);
    console.log(cart.productList);

    this.updateCartTotals(cart);
    this.saveCart(cart);
  }

  private updateCartTotals(cart: ICart) {
    cart.subTotal = cart.productList.reduce(
      (total, cartItem) => {
        return total + (cartItem.product.price * cartItem.count)
      }, 0
    )

    cart.taxTotal = parseFloat(
      (cart.subTotal * this.TAX_RATE).toFixed(2)
    );

    cart.shippingTotal = cart.productList.length < 0 ?
        cart.subTotal > 100 ? 0 : this.SHIPPING_COST
        : 0
    ;

    cart.costTotal = cart.subTotal + cart.taxTotal + cart.shippingTotal;
  }

  private createCart(account: IAccount) {
    const cart: ICart = {
      id: account.id,
      productList: [],
      subTotal: 0,
      taxTotal: 0,
      shippingTotal: 0,
      costTotal: 0,
    }

    this.httpService
      .createCart(cart)
      .pipe(first())
      .subscribe({
        next: (cart) => {
          this.$cart.next(cart);
        },
        error: (err) => {
          console.error(err);
          this.$cartLoadingError.next(this.CART_LOADING_ERROR)
        }
      });
  }

  private saveCart(cart: ICart) {
    this.httpService.updateCart(cart).pipe(first()).subscribe({
      next: (cart) => {
        this.$cart.next(cart);
      },
      error: (err) => {
        console.error(err);
        this.$cartLoadingError.next(this.CART_UPDATE_ERROR);
      }
    });
  }

}
