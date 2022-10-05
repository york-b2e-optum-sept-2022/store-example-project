import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../account.service";
import {NgForm} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ILoginForm} from "../_interfaces/ILoginForm";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private accountService: AccountService) {
    this.accountService
      .$loginError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(message => this.errorMessage = message);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onRegisterClick() {
    this.accountService.$isRegistering.next(true);
  }

  onLogin(form: NgForm) {
    this.accountService.login(
      form.value as ILoginForm
    );
  }

}
