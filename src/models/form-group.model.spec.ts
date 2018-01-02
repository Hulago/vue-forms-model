import { FormGroup } from './form-group.model';
import { FormControl } from './form-control.model';

describe('Form Control Class', () => {
  let ac: FormGroup;

  beforeEach(() => {
    ac = new FormGroup({
      user: new FormControl(),
      passowrd: new FormControl()
    });
  });

  it('FormControl is instantiable', () => {
    expect(ac).toBeInstanceOf(FormGroup);
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
    expect(ac.$controls).toBeDefined();
  });

  it('should not be formControl', () => {
    expect(ac.isFormControl()).toBeFalsy();
  });

  it('should be formGroup', () => {
    expect(ac.isFormGroup()).toBeTruthy();
  });

  it('should set value', () => {
    expect(ac.value).toBeUndefined();
    ac.setValue(1);
    expect(ac.value).toBe(1);
  });
  
});
