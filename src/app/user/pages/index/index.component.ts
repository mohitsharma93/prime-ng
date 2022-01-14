import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl } from '@angular/forms'

import { MEDIUM_PASSWORD_REGEX, ONLY_DIGIT } from '../../../utils/RegexConstant';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  public loginForm: FormGroup;
  public checkform: boolean = false;

  constructor(
    private _fb: FormBuilder
  ) {
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
