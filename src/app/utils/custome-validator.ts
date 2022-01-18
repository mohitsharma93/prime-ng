import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

type returnTypeKeyBoolean = { [key: string]: boolean } | null

export class CustomValidators {

  public static passwordsMatchWithConfirm(whomWithMatchControlName: string): ValidatorFn {
    return (control: AbstractControl): returnTypeKeyBoolean => {
      if (!control || !control.parent) {
          return null;
      }
      if (control.value === control.parent.get(whomWithMatchControlName)?.value) {
        return null
      }
      return { misMatchWithConfirm: true };
    };
  }

}
