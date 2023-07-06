import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorService {

  constructor() { }

  /**
   * @description: To check if a form control value contains only whitespace characters.
   * @returns: This validator function checks if the input value contains only whitespace characters or 
   * is empty, and returns a validation error object if it does.
   */
  public whitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  /**
   * @description: Checks if a control's value contains only whitespace or HTML tags.
   * @returns: A validator function that checks if the input contains only whitespace or HTML tags and
   * returns a ValidationErrors object with the key "whitespace" if it does, or null if it doesn't.
   */
  public sanitizeAndWhiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value.replace(/<[^>]*>/g, '') || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

}