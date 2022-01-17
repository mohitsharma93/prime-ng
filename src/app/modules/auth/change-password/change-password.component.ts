import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, } from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changepwdForm!: FormGroup;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.changepwdForm = this.formBuilder.group({
      new_password: ['', [Validators.required, Validators.minLength(4)]],
      confirm_Password: ['', [Validators.required]],

    })
  }

  get getControl() {
    return this.changepwdForm.controls;
  }

  onSubmit() {
    console.log(this.changepwdForm);
  }

}
