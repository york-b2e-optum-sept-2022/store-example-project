import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {BehaviorSubject, first} from "rxjs";
import {IAccount} from "./interfaces/IAccount";
import {IRegistrationForm} from "./interfaces/IRegistrationForm";
import {v4 as uuid} from 'uuid';
import {ILoginForm} from "./interfaces/ILoginForm";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  $account = new BehaviorSubject<IAccount | null>(null);
  $isRegistering = new BehaviorSubject<boolean>(false);
  $registrationError = new BehaviorSubject<string | null>(null);
  $loginError = new BehaviorSubject<string | null>(null);

  private readonly LOGIN_INVALID_EMAIL_MESSAGE = "You must provide your email";
  private readonly LOGIN_INVALID_PASSWORD_MESSAGE = "You must provide your password";
  private readonly LOGIN_INVALID_CREDENTIALS = 'Invalid login';
  private readonly LOGIN_HTTP_ERROR_MESSAGE = 'Unable to login, please try again later';

  private readonly REGISTER_INVALID_EMAIL_MESSAGE = "You must provide a valid email";
  private readonly REGISTER_INVALID_FIRST_NAME_MESSAGE = "You must provide a first name";
  private readonly REGISTER_INVALID_LAST_NAME_MESSAGE = "You must provide a last name";
  private readonly REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE = 'Your password\'s do not match';
  private readonly REGISTER_INVALID_PASSWORD_MATCH_MESSAGE = 'Your password must be at least 5 characters long';
  private readonly REGISTER_EXISTING_ACCOUNT_MESSAGE = 'There is already an account with that email';
  private readonly REGISTER_HTTP_ERROR_MESSAGE = 'Unable to create your account, please try again later';

  constructor(private httpService: HttpService) {
  }

  login(form: ILoginForm) {
    // field validation
    if (form.email.length < 1) {
      this.$loginError.next(this.LOGIN_INVALID_EMAIL_MESSAGE);
      return;
    }
    if (form.password.length < 1) {
      this.$loginError.next(this.LOGIN_INVALID_PASSWORD_MESSAGE);
      return;
    }

    this.httpService.findAccountsByEmail(form.email).pipe(first()).subscribe({
      next: (accountList) => {

        // validate password
        const foundAccount = accountList.find(
          account => account.password === form.password
        );
        if (!foundAccount) {
          this.$loginError.next(this.LOGIN_INVALID_CREDENTIALS);
          return;
        }

        // login
        this.$account.next(foundAccount);
      },
      error: (err) => {
        console.error(err);
        this.$loginError.next(this.LOGIN_HTTP_ERROR_MESSAGE)
      }
    });

  }

  register(form: IRegistrationForm) {
    // field validation
    if (form.email.length < 5 || !form.email.includes('@') || !form.email.includes('.')) {
      this.$registrationError.next(this.REGISTER_INVALID_EMAIL_MESSAGE);
      return;
    }
    if (form.firstName.length < 1) {
      this.$registrationError.next(this.REGISTER_INVALID_FIRST_NAME_MESSAGE);
      return;
    }
    if (form.lastName.length < 1) {
      this.$registrationError.next(this.REGISTER_INVALID_LAST_NAME_MESSAGE);
      return;
    }
    if (form.password.length < 5) {
      this.$registrationError.next(this.REGISTER_INVALID_PASSWORD_MATCH_MESSAGE);
      return;
    }
    if (form.password !== form.confirmPassword) {
      this.$registrationError.next(this.REGISTER_INVALID_PASSWORD_LENGTH_MESSAGE);
      return;
    }

    // check if account is already registered with input email
    this.httpService.findAccountsByEmail(form.email).pipe(first()).subscribe({
      next: (accountList) => {
        if (accountList.length > 0) {
          this.$registrationError.next(this.REGISTER_EXISTING_ACCOUNT_MESSAGE)
          return;
        }

        // all validation has passed, create the account
        const account: IAccount = {
          id: uuid(),
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password
        }

        this.httpService.register(account).pipe(first()).subscribe({
          next: (account) => {
            this.$account.next(account);
          },
          error: (err) => {
            console.error(err)
            this.$registrationError.next(this.REGISTER_HTTP_ERROR_MESSAGE)
          },
        });
      },
      error: (err) => {
        console.error(err)
        this.$registrationError.next(this.REGISTER_HTTP_ERROR_MESSAGE)
      },
    })

  }

}
