import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlDirective } from "@angular/forms";
import { Router } from '@angular/router';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { MEDIUM_PASSWORD_REGEX, ONLY_DIGIT } from 'src/app/shared/validators/Regex-validators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public checkform: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userAuthService: UserAuthService,
    private activeUserService: ActiveUserService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
  }



  public onlyDigit(e: KeyboardEvent): void {
    const inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode !== 8 && !ONLY_DIGIT.test(inputChar)) {
      e.preventDefault();
    }
  }

  onSubmit() {

    console.log('innn submit', this.loginForm)
    if (!this.loginForm.valid) {
      // console.log(this.loginForm.value);
      this.loginForm.markAllAsTouched();
    } else {

      const paramsString = `
      grant_type=${this.loginForm.value['grant_type']}&
      username=${this.loginForm.value['username']}&
      password=${this.loginForm.value['password']}&
      LOGINTYPE=${this.loginForm.value['loginType']}&
      ISOTP=${this.loginForm.value['isOtp']}&
      `;
      const req = {
        url: 'token',
        params: paramsString
      }
      this.userAuthService.loginUser(req).subscribe((res: any) => {
        if (res && res.access_token) {
          this.activeUserService.setToken(res.access_token, res.token_type);
        }
        if (res && res.AspNetuserId) {
          const user = {
            AspNetuserId: res.AspNetuserId,
            UserId: res.UserId || '',
            userName: res.userName || '',
            MobileNumber: res.MobileNumber || ''
          };
          this.activeUserService.setUser(user);
          this.router.navigate(["admin/dashboard"]);

        }

      });
    }
  }

  private initializeForm() {
    this.loginForm = this.fb.group(
      {
        username: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
        password: new FormControl('', [Validators.required, Validators.pattern(MEDIUM_PASSWORD_REGEX)]),
        isOtp: new FormControl(false),
        grant_type: new FormControl('password'),
        loginType: new FormControl('test'),
      }
    )
  }

}


