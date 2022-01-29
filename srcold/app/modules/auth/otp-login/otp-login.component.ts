import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_CONFIG } from 'src/app/app.config';
import { ActiveUserService } from 'src/app/shared/services/active-user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { EncryptionService } from 'src/app/shared/services/encryption.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
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
  isTimerOn: boolean = false;
  remainingTime: any = '00:00';

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private toasterService: ToasterService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  public onlyDigit(e: KeyboardEvent): void {
    const inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode !== 8 && !ONLY_DIGIT.test(inputChar)) {
      e.preventDefault();
    }
  }

  onSendOtp() {
    this.loginOtpForm.controls['MobileNumber'].disable();
    const req = {
      url: APP_CONFIG.API.AUTH.SEND_OTP,
      params: {
        MobileNumber: this.loginOtpForm.value['MobileNumber'],
      }
    }
    this.ds.post(req).subscribe((res: any) => {
      this.isTimerOn = true;
      this.startTimer(30);
      if (res) {
        this.toasterService.success('OTP has been sent.');
      }
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
        if (res && res.Userid && res.IsUserExist === "True") {
          this.toasterService.success('OTP is Verified Successfully.');
          const url = `auth/change-password/${res.Userid}`;
          this.router.navigate([url]);
        } else {
          this.toasterService.error('OTP Code is Invalid')
        }

      });
    }
  }

  // onSubmit() {
  //   if (!this.loginOtpForm.valid) {
  //     this.loginOtpForm.markAllAsTouched();
  //   } else {
  //     const req = {
  //       url: APP_CONFIG.API.AUTH.VERIFY_OTP,
  //       params: this.loginOtpForm.value

  //     }
  //     this.ds.post(req).subscribe((res: any) => {
  //       if (res && res.Userid) {
  //         this.toasterService.success('OTP is Verified Successfully.');
  //         const url = `auth/change-password/${res.Userid}`;
  //         this.router.navigate([url]);
  //       }
  //     });
  //   }
  // }
  private initializeForm() {
    this.loginOtpForm = this.fb.group(
      {
        MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
        Otp: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),

      }
    )
  }

  startTimer(remaining: number) {
    if (remaining === 0) {
      this.isTimerOn = false;
   }
    let m: any = Math.floor(remaining / 60);
    let s: any = remaining % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    this.remainingTime = m + ':' + s;
    remaining -= 1;

    if (remaining >= 0 && this.isTimerOn) {
      setTimeout(() => {
        this.startTimer(remaining);
      }, 1000);
      return;
    }

    if (!this.isTimerOn) {
      return;
    }
  }
  public enableField() {
    this.loginOtpForm.controls['MobileNumber'].enable();
    this.loginOtpForm.controls['MobileNumber'].setValue('');
    this.sendCount = 0;
    this.isTimerOn = false;
    this.remainingTime = '00:00';
  }

}
