import { forOwn, set, debounce } from 'lodash';
import {
  AbstractControl,
  IAbstractControlAsyncValidator,
  IAbstractControlValidator,
  IControls
} from './abstract-control.model';

export class FormGroup extends AbstractControl {
  constructor(
    controls: IControls,
    validators: Array<IAbstractControlValidator> = [],
    asyncValidators: Array<IAbstractControlAsyncValidator> = [],
    options: any = {}
  ) {
    super(validators, asyncValidators, options);
    this.$controls = controls;
    this.value = {};

    let self = this;

    forOwn(this.$controls, (control, controlName) => {
      set(this, controlName, control);
      control.$parent = null as any;
      control.$parent = self;
      set(control, '$name', controlName);
      set(this.value, controlName, control.value);
    });

    if (this.$options.debounce === 0) {
      this.validateDebounce = this.validate;
    } else {
      this.validateDebounce = debounce(() => {
        this.validate();
      }, this.$options.debounce);
    }
  }

  validate() {
    let validSync = this.validateSync();
    if (validSync) {
      let _arr = [];
      // get all valid state from the child controls
      for (let key of Object.keys(this.$controls ? this.$controls : {})) {
        _arr.push((this.$controls as any)[key].$valid);
      }
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr);
    }
    this.$valid = validSync;
    this.notifyParent();
    return Promise.resolve(this.$valid);
  }

  onChange(state: any) {
    if (state.dirty) {
      this.$dirty = true;
    }
    this.$focus = state.focus;
    if (!this.$touch) {
      this.$touch = state.touch;
    }

    this.$loading = state.loading;
    set(this.value, state.name, state.value);
    this.validateDebounce();
    this.notifyParent();

    return false;
  }

  setValue(value: Object) {
    forOwn(value, (val, key) => {
      if (this.$controls && this.$controls[key]) {
        (this.$controls[key] as any).setValue(val);
      } else {
        console.warn(`invalid property ${key}`);
      }
    });

    this.validateDebounce();
  }
}
