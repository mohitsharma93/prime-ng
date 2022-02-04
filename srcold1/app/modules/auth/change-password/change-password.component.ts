import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_CONFIG } from "src/app/app.config";
import { DataService } from "src/app/shared/services/data.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import { CustomValidators } from "src/app/shared/validators/custom-validators";
import { MEDIUM_PASSWORD_REGEX } from "src/app/shared/validators/Regex-validators";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params && params.id) {
        this.UserName?.setValue(params.id);
      }
    });

  }
  public onSubmit(): void {
    if (!this.changePasswordForm.valid) {
      this.changePasswordForm.markAllAsTouched();
    } else {
      const req = {
        url: APP_CONFIG.API.AUTH.CHANGE_PASSWORD,
        params: this.changePasswordForm.value,
      }
      this.ds.post(req).subscribe((res: any) => {
        this.toasterService.success('Password Changed Successfully.');
        this.router.navigate(["auth/login"]);
      });
    }
  }

  get UserName() {
    return this.changePasswordForm.get("UserName");
  }

  private initializeForm() {
    this.changePasswordForm = this.fb.group(
      {
        UserName: (''),
        Password: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX),]),
        ConfirmPassword: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX), CustomValidators.passwordsMatchWithConfirm('Password')])
      },
    )
  }

}




