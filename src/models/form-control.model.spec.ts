import { FormControl } from './form-control.model';

describe('Form Control Class', () => {
  let ac: FormControl;

  beforeEach(() => {
    ac = new FormControl(undefined);
  });

  it('FormControl is instantiable', () => {
    expect(new FormControl()).toBeInstanceOf(FormControl);
  });

  it('inital state', () => {
    expect(ac.$dirty).toBeFalsy();
    expect(ac.$touch).toBeFalsy();
    expect(ac.$focus).toBeFalsy();
    expect(ac.$loading).toBeFalsy();
    expect(ac.$errors).toBeInstanceOf(Object);
    expect(ac.value).toBeUndefined();
    expect(ac.validators.length).toBe(0);
    expect(ac.asyncValidators.length).toBe(0);
    expect(ac.$name).toBe('root');
  });

  it('should be formControl', () => {
    expect(ac.isFormControl()).toBeTruthy();
  });

  it('should not be formGroup', () => {
    expect(ac.isFormGroup()).toBeFalsy();
  });

  it('should set value', () => {
    expect(ac.value).toBeUndefined();
    ac.setValue(1);
    expect(ac.value).toBe(1);
  });
});
