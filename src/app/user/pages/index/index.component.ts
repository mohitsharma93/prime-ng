import { Component, OnInit } from '@angular/core';
import{FormBuilder , Validators, FormGroup,AbstractControl} from '@angular/forms'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  loginForm:FormGroup;
  checkform:boolean=false;


  constructor(
    private _fb:FormBuilder
  ) 
  {this.loginForm=this._fb.group({

    "mobile":["",Validators.required],
    "password":["",Validators.required]

  }) }

  ngOnInit(): void {
  }
  onSubmit(){
    if(this.loginForm.invalid)
    {
      this.checkform= true;
      return;
    }
    else
    {
      console.log(this.loginForm.value);
    }
  }


}
