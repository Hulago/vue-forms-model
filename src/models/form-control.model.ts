import {
  AbstractControl,
  IAbstractControlAsyncValidator,
  IAbstractControlValidator,
  IControls
} from "./abstract-control.model";

export interface IFromControlOptions {
  debounce?: number;
}

export class FormControl extends AbstractControl {
  constructor(
    value: any = undefined,
    validators: Array<IAbstractControlValidator> = [],
    asyncValidators: Array<IAbstractControlAsyncValidator> = [],
    options: IFromControlOptions = {}
  ) {
    super(validators, asyncValidators, options);
    this.value = value;
  }

  setValue(value: any) {
    this.value = value;
    this.validateDebounce();
  }
}
