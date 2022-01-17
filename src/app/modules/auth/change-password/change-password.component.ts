import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MEDIUM_PASSWORD_REGEX } from "src/app/utils/RegexConstant";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordForm!: FormGroup;

  constructor() {
    this.formInit();
  }

  ngOnInit(): void { }

  public formInit() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX)])
    })
  }

  public onSubmit(): void {
    console.log(this.changePasswordForm.value);
    if (this.changePasswordForm.valid) {

    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

}
