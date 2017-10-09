import { get, debounce, has, forOwn } from 'lodash';

export interface IAbstractControlValidator {
  (ac: AbstractControl): boolean;
}

export interface IAbstractControlAsyncValidator {
  (ac: AbstractControl): Promise<Boolean>;
}

export interface IControls {
  [control: string]: IAbstractControl;
}

export interface IAbstractControlOptions {
  debounce: number;
}

export interface IAbstractControl {
  $valid: boolean;
  $focus: boolean;
  $touch: boolean;
  $dirty: boolean;
  $enable: boolean;
  $loading: boolean;
  $options?: IAbstractControlOptions;
  $parent?: IAbstractControl;
  $controls?: IControls;
  value: any;
  $errors?: any;
  validateForm?: any;
}

const DEFAULT_DEBOUNCE_TIMEOUT = 0;

export class AbstractControl implements IAbstractControl {
  public $name: string;
  public $valid: boolean;
  public $focus: boolean;
  public $touch: boolean;
  public $dirty: boolean;
  public $enable: boolean;
  public $loading: boolean;
  public $parent: AbstractControl;
  public $controls?: IControls;
  public $options: IAbstractControlOptions;
  public value: any;
  public $errors?: any;

  public validators: Array<IAbstractControlValidator>;
  public asyncValidators: Array<IAbstractControlAsyncValidator>;

  public validateDebounce: Function;

  constructor(
    validators: Array<IAbstractControlValidator> = [],
    asyncValidators: Array<IAbstractControlAsyncValidator> = [],
    options: any = {}
  ) {
    this.$name = 'root';
    this.$valid = true;
    this.$focus = false;
    this.$touch = false;
    this.$dirty = false;
    this.$enable = true;
    this.$loading = false;
    this.$options = {
      debounce: get(options, 'debounce', DEFAULT_DEBOUNCE_TIMEOUT)
    };
    this.value = undefined;
    this.$parent = null as any;
    this.$errors = {};
    this.validators = validators;
    this.asyncValidators = asyncValidators;

    if (this.$options.debounce === 0) {
      this.validateDebounce = this.validate;
    } else {
      this.validateDebounce = debounce(() => {
        this.validate();
      }, this.$options.debounce);
    }
  }

  reduceBooleanArray(arr: Array<boolean> = []) {
    return arr.reduce((acc, item) => {
      return acc && item;
    }, true);
  }

  onChange(control: AbstractControl): boolean {
    throw 'not implemented';
  }

  //  Execute onChange to notify parent of a state change

  notifyParent() {
    if (this.$parent && this.$parent.onChange) {
      this.$parent.onChange(this);
    }
    // this.$emit('state', this.state)
  }

  addError(error: string, message: string) {
    this.$errors = {
      ...this.$errors,
      [error]: message
    };
  }

  removeError(error: string) {
    delete this.$errors[error];
    this.$errors = {
      ...this.$errors
    };
  }

  validate() {
    let validSync = this.validateSync();
    if (validSync && this.asyncValidators && this.asyncValidators.length > 0) {
      this.$loading = true;
      this.notifyParent();
      return this.validateAsync().then(validAsync => {
        this.$valid = validAsync;
        this.$loading = false;
        this.notifyParent();
        return this.$valid;
      });
    } else {
      this.$valid = validSync;
      this.notifyParent();
      return Promise.resolve(this.$valid);
    }
  }

  isFormGroup() {
    return has(this, 'controls');
  }

  isFormControl() {
    return !has(this, 'controls');
  }

  validateForm(): Promise<boolean> {
    if (this.isFormGroup()) {
      let validSync = this.validateSync();

      let _arr: Array<Promise<boolean>> = [];
      forOwn(this.controls, (control, key) => {
        _arr.push(Promise.resolve(control.validateForm()));
      });

      return Promise.all(_arr).then(all => {
        return all.reduce((acc, res) => acc && res, validSync);
      });
    } else {
      return this.validate();
    }
  }

  /**
   * Execute all sync validation on the validators props
   */
  validateSync(): boolean {
    if (!this.validators) {
      return true;
    }

    return this.validators
      .map(validator => validator.call(this, this))
      .reduce((acc, res) => acc && res, true);
  }

  /**
   * 
   */
  validateAsync(): Promise<boolean> {
    if (!this.asyncValidators) {
      return Promise.resolve(true);
    }
    let _arr = [];
    _arr = this.asyncValidators.map(val => val.call(this, this));

    return Promise.all(_arr)
      .then(arr => {
        return this.reduceBooleanArray(arr);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }
}
