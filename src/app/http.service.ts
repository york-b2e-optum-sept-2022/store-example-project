import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAccount} from "./_interfaces/IAccount";
import {IRegistrationForm} from "./_interfaces/IRegistrationForm";
import {IProduct} from "./_interfaces/IProduct";
import {ICart} from "./_interfaces/ICart";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  findAccountsByEmail(email: string) {
    return this.httpClient.get(
      'http://localhost:3000/accounts?email=' + email,
    ) as Observable<IAccount[]>;
  }

  register(form: IAccount) {
    return this.httpClient.post(
      'http://localhost:3000/accounts',
      form
    ) as Observable<IAccount>;
  }

  getProductList() {
    return this.httpClient.get(
      'http://localhost:3000/products'
    ) as Observable<IProduct[]>
  }


  createCart(cart: ICart) {
    return this.httpClient.post(
      'http://localhost:3000/carts',
      cart
    ) as Observable<ICart>;
  }

  getCartById(id: string) {
    return this.httpClient.get(
      'http://localhost:3000/carts/' + id,
    ) as Observable<ICart>;
  }

  updateCart(cart: ICart) {
    return this.httpClient.put(
      'http://localhost:3000/carts/' + cart.id,
      cart
    ) as Observable<ICart>;
  }
}
