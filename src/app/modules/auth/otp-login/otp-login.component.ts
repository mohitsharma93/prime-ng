import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ONLY_DIGIT } from 'src/app/utils/RegexConstant';

@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent implements OnInit {

  public loginOtpForm: FormGroup;

  constructor() {
    this.logInFormInit();
  }

  ngOnInit(): void {
  }

  public logInFormInit() {
    this.loginOtpForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      otp: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)])
    })
  }

  public onlyDigit(e: KeyboardEvent): void {
    const inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode !== 8 && !ONLY_DIGIT.test(inputChar)) {
      e.preventDefault();
    }
  }

  public verifyOtp(): void {
    if (this.loginOtpForm.value) {
      console.log('this.loginOtpForm.value', this.loginOtpForm.value)
    } else {
      this.loginOtpForm.markAllAsTouched();
    }
  }
}
