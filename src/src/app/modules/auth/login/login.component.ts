import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MEDIUM_PASSWORD_REGEX, ONLY_DIGIT } from 'src/app/utils/RegexConstant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public checkform: boolean = false;

  constructor() {
    this.logInFormInit();
  }

  ngOnInit(): void {
  }

  public logInFormInit() {
    this.loginForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX)])
    })
  }

  public onlyDigit(e: KeyboardEvent): void {
    const inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode !== 8 && !ONLY_DIGIT.test(inputChar)) {
      e.preventDefault();
    }
  }

  onSubmit() {
    console.log('innn submit', this.loginForm)
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }




}
