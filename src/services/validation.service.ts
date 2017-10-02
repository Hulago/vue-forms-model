import * as _ from 'lodash';

import { AbstractControl } from 'core';

/* tslint:disable:max-line-length */
const emailRegExp = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

export class ValidationService {
  private static _instance: ValidationService;

  static createInstance() {
    ValidationService.getInstance();
  }

  static getInstance() {
    return this._instance || (this._instance = new this());
  }

  static order = ['required', 'min'];

  requiredValidator(fc: AbstractControl) {
    if (fc.value && fc.value.toString().length > 0) {
      fc.removeError('required');
      return true;
    } else {
      fc.addError('required', 'Field required');
      return false;
    }
  }

  minValidator(min) {
    return (fc: AbstractControl) => {
      if (fc.value && fc.value.length >= min) {
        fc.removeError('min');
        return true;
      } else {
        fc.addError('min', `min length ${min}`);
        return false;
      }
    };
  }

  emailValidator(fc: AbstractControl) {
    if (fc.value && !_.isEmpty(fc.value) && fc.value.match(emailRegExp) === null) {
      fc.addError('email', 'Invalid email address');
      return false;
    }

    fc.removeError('email');
    return true;
  }

  confirmPasswordValidator(fc: AbstractControl, passwordField: string, matchValue: string) {
    if (fc.value[passwordField] && matchValue && fc.value[passwordField] === matchValue) {
      fc.removeError('passwordMatch');
      return true;
    }

    if (fc.value[passwordField] && matchValue && fc.value[passwordField] !== matchValue) {
      fc.addError('passwordMatch', 'Password do not match');
      return false;
    }

    return true;
  }

  getError(fc, order = ValidationService.order) {
    for (let key of order) {
      if (fc.errors[key] !== undefined) {
        return fc.errors[key];
      }
    }

    return fc.errors[Object.keys(fc.errors)[0]] || true;
  }
}
