import { forOwn, set, debounce } from "lodash";
import {
  AbstractControl,
  IAbstractControlAsyncValidator,
  IAbstractControlValidator,
  IControls
} from "./abstract-control.model";
import { IAbstractControl } from "../index";

export class FormGroup extends AbstractControl {
  constructor(
    controls: IControls,
    validators: Array<IAbstractControlValidator> = [],
    asyncValidators: Array<IAbstractControlAsyncValidator> = [],
    options: any = {}
  ) {
    super(validators, asyncValidators, options);
    this.controls = controls;
    this.value = {};

    let self = this;

    forOwn(this.controls, (control, controlName) => {
      set(this, controlName, control);
      control.$parent = null;
      control.$parent = self;
      set(control, "name", controlName);
      set(this.value, controlName, control.value);
    });

    if (this.debounce === 0) {
      this.validateDebounce = this.validate;
    } else {
      this.validateDebounce = debounce(() => {
        this.validate();
      }, this.debounce);
    }
  }

  validate() {
    let validSync = this.validateSync();
    if (validSync) {
      let _arr = [];
      // get all valid state from the child control
      for (const key in this.controls) {
        if (this.controls.hasOwnProperty(key)) {
          const element = this.controls[key];
          _arr.push(element.$valid);
        }
      }
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr);
    }
    this.$valid = validSync;
    this.notifyParent();
    return Promise.resolve(this.$valid);
  }

  onChange(state: AbstractControl) {
    if (state.$dirty) {
      this.$dirty = true;
    }
    this.$focus = state.$focus;
    if (!this.$touch) {
      this.$touch = state.$touch;
    }

    this.$loading = state.$loading;
    set(this.value, state.$name, state.value);
    this.validateDebounce();
    this.notifyParent();

    return false;
  }

  setValue(value: Object) {
    forOwn(value, (val, key) => {
      if (this.controls[key]) {
        (this.controls[key] as any).setValue(val);
      } else {
        console.warn(`invalid property ${key}`);
      }
    });

    this.validateDebounce();
  }
}
