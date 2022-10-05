import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first, Subject} from "rxjs";
import {IProduct} from "./_interfaces/IProduct";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  _productList: IProduct[] = [];
  $productList = new BehaviorSubject<IProduct[]>([]);
  $productListError = new BehaviorSubject<string | null>(null);

  private readonly PRODUCT_LIST_HTTP_ERROR = 'Unable to get the list of products, please try again later'

  constructor(private httpService: HttpService) {
    this.httpService.getProductList().pipe(first()).subscribe({
      next: productList => {
        this._productList = productList;
        this.$productList.next(productList)
      },
      error: (err) => {
        console.error(err);
        this.$productListError.next(this.PRODUCT_LIST_HTTP_ERROR);
      }
    });
  }

  onSearchTextChange(searchText: string) {
    this.$productList.next(
      this._productList.filter(product => product.name.toUpperCase().includes(searchText.toUpperCase()))
    );
  }


}
