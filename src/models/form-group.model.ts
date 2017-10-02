import * as _ from 'lodash';
import {
  AbstractControl,
  IAbstractControlAsyncValidator,
  IAbstractControlValidator,
  IControls,
} from './abstract-control.model';

export class FormGroup extends AbstractControl {
  constructor(
    controls: IControls,
    validators: Array<IAbstractControlValidator> = [],
    asyncValidators: Array<IAbstractControlAsyncValidator> = [],
    options: any = {},
  ) {
    super(validators, asyncValidators, options);
    this.controls = controls;
    this.value = {};

    let self = this;

    _.forOwn(this.controls, (control, controlName) => {
      _.set(this, controlName, control);
      control.parent = null;
      control.parent = self;
      _.set(control, 'name', controlName);
      _.set(this.value, controlName, control.value);
    });

    if (this.debounce === 0) {
      this.validateDebounce = this.validate;
    } else {
      this.validateDebounce = _.debounce(() => {
        this.validate();
      }, this.debounce);
    }
  }

  validate() {
    let validSync = this.validateSync();
    if (validSync) {
      let _arr = [];
      // get all valid state from the child controls
      for (let key of Object.keys(this.controls)) {
        _arr.push(this.controls[key].valid);
      }
      //reduce the array of the child valid state controls
      validSync = this.reduceBooleanArray(_arr);
    }
    this.valid = validSync;
    this.notifyParent();
    return Promise.resolve(this.valid);
  }

  onChange(state) {
    if (state.dirty) {
      this.dirty = true;
    }
    this.focus = state.focus;
    if(!this.touch) {
      this.touch = state.touch;
    }
    
    this.loading = state.loading;
    _.set(this.value, state.name, state.value);
    this.validateDebounce();
    this.notifyParent();

    return false;
  }

  setValue(value: Object) {
    _.forOwn(value, (val, key) => {
      if (this.controls[key]) {
        (this.controls[key] as any).setValue(val);
      } else {
        console.warn(`invalid property ${key}`);
      }
    });

    this.validateDebounce();
  }
}
