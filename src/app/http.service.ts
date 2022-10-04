import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAccount} from "./interfaces/IAccount";
import {IRegistrationForm} from "./interfaces/IRegistrationForm";

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
}
