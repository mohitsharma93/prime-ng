import { FormGroup } from "@angular/forms";

/**
 * @name PasswordMustMatch
 * @param controlName
 * @param matchingControlName
 * @used ReactiveFormModule
 * @description To match Password and Confirm Password must be same
 */
export function passwordMatch(Password: string, ConfirmPassword: string) {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[Password];
    const confirmPasswordControl = formGroup.controls[ConfirmPassword];

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors["mustMatch"]
    ) {
      return;
    }
    // set error on matchingControl if validation fails
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mustMatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  };
}



