import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../account.service";
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../products.service";
import {IProduct} from "../_interfaces/IProduct";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnDestroy {

  productList: IProduct[] = [];
  errorMessage: string | null = null;

  onDestroy = new Subject();

  constructor(private productsService: ProductsService) {
    this.productsService.$productList.pipe(takeUntil(this.onDestroy)).subscribe(
      productList => this.productList = productList
    );
    this.productsService.$productListError.pipe(takeUntil(this.onDestroy)).subscribe(
      message => this.errorMessage = message
    )
  }

  ngOnDestroy(): void {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

}
