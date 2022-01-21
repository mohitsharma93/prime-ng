import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_CONFIG } from 'src/app/app.config';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { ONLY_DIGIT } from 'src/app/shared/validators/Regex-validators';


@Component({
  selector: 'app-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent implements OnInit {

  loginOtpForm: FormGroup;
  checkform: boolean = false;
  sendCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
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

  onSendOtp() {
    const req = {
      url: APP_CONFIG.API.AUTH.SEND_OTP,
      params: {
        MobileNumber: this.loginOtpForm.value['MobileNumber'],
        DeviceId: this.loginOtpForm.value['DeviceId'],
      }
    }
    this.ds.post(req).subscribe((res: any) => {
      console.log('Otp send');
    });
    this.sendCount = +1;
  }

  onSubmit() {
    if (!this.loginOtpForm.valid) {
      this.loginOtpForm.markAllAsTouched();
    } else {
      const req = {
        url: APP_CONFIG.API.AUTH.VERIFY_OTP,
        params: this.loginOtpForm.value

      }
      this.ds.post(req).subscribe((res: any) => {
        if (res.Data && res.Data.Userid) {
          this.getToken(this.loginOtpForm.value['MobileNumber'], this.loginOtpForm.value['Otp'])
        }
      });
    }
  }

  getToken(username: string, otp: any) {
    const paramsString = `
    grant_type=password&
    username=${username}&
    password=${otp}&
    LOGINTYPE=test&
    ISOTP=true&
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

  private initializeForm() {
    this.loginOtpForm = this.fb.group(
      {
        MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
        DeviceId: new FormControl('dbsd'),
        Otp: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      }
    )
  }
}
