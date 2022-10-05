import {Component, Input, OnDestroy} from '@angular/core';
import {IProduct} from "../_interfaces/IProduct";
import {CartService} from "../cart.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input() product!: IProduct;
  @Input() inCart!: boolean;
  @Input() cartCount!: number;

  constructor(private cartService: CartService) {
  }

  onAddToCartClick() {
    this.cartService.addProductToCart(this.product);
  }

  onIncreaseCartCount() {
    this.cartService.updateCartCount(
      this.product, this.cartCount + 1
    );
  }

  onDecreaseCartCount() {
    this.cartService.updateCartCount(
      this.product, this.cartCount - 1
    );
  }

  onRemoveProduct() {
    this.cartService.removeItemFromCart(this.product);
  }
}
