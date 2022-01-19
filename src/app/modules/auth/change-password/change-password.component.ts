import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { APP_CONFIG } from "src/app/app.config";
import { DataService } from "src/app/shared/services/data.service";
import { passwordMatch } from "src/app/shared/validators/form-validators";
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ds: DataService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void { }



  public onSubmit(): void {
    console.log(this.changePasswordForm.value);
    if (!this.changePasswordForm.valid) {
      console.log(this.changePasswordForm.value);
      this.changePasswordForm.markAllAsTouched();
    } else {
      const req = {
        url: APP_CONFIG.API.AUTH.CHANGE_PASSWORD,
        params: this.changePasswordForm.value
      }
      this.ds.post(req).subscribe((res: any) => {
      });
    }
  }

  private initializeForm() {
    this.changePasswordForm = this.fb.group(
      {
        Password: new FormControl('', [Validators.required]),
        ConfirmPassword: new FormControl('', [Validators.required]),
        // confirmPassword: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX)])
      },
      {
        validator: passwordMatch("password", "ConfirmPassword"),

      }

    )
  }


}

