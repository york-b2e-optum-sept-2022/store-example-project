import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../account.service";
import {NgForm} from "@angular/forms";
import {from, Subject, takeUntil} from "rxjs";
import {IRegistrationForm} from "../_interfaces/IRegistrationForm";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {

  errorMessage: string | null = null;
  onDestroy = new Subject();

  constructor(private accountService: AccountService) {
    this.accountService
      .$registrationError
      .pipe(takeUntil(this.onDestroy))
      .subscribe(message => this.errorMessage = message);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }

  onLoginClick() {
    this.accountService.$isRegistering.next(false);
  }

  onRegisterClick(form: NgForm) {
    this.accountService.register(
      form.value as IRegistrationForm
    );
  }

}
